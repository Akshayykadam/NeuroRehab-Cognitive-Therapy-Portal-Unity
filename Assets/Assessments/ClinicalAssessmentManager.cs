using System;
using System.Collections.Generic;
using System.IO;
using UnityEngine;
using UnityEngine.UI;
using NeuroRehab;

public class ClinicalAssessmentManager : MonoBehaviour
{
    #region DATA

    [Serializable]
    public class Answer
    {
        public int Score;
        public string Text;

        public Answer(int score, string text)
        {
            Score = score;
            Text = text;
        }
    }

    [Serializable]
    public class Question
    {
        public string Section;
        public string Title;
        public string Instruction;

        // Sprite is assigned at runtime via Resources.Load
        public Sprite Image;

        public List<Answer> Answers = new List<Answer>();

        public Question(string section, string title, string instruction)
        {
            Section = section;
            Title = title;
            Instruction = instruction;
        }
    }

    #endregion

    // -------------------------------------------------------------------------
    // Image loading
    // -------------------------------------------------------------------------
    private const string ImageBasePath  = "AssessmentImages";
    private const string DummyImagePath = "AssessmentImages/DummyImage";

    [Header("User Management")]
    public string targetUserId = "1001";
    public string targetUserName = "Patient Name";
    public string userId { get => targetUserId; set => targetUserId = value; }
    public string userName { get => targetUserName; set => targetUserName = value; }

    [Header("Localisation")]
    public string AppLanguage = "English";
    public string targetLanguage { get => AppLanguage; set => AppLanguage = value; }

    [Header("UI – Main Panels")]
    [Tooltip("Panel shown on start containing assessment selection buttons.")]
    public GameObject selectionPanel;

    [Tooltip("Panel containing the assessment questions, images, and answer options.")]
    public GameObject assessmentPanel;

    [Header("UI – Selection Screen (3 Main Actions)")]
    public Button startFmaueButton;
    public Button startMiniBestButton;
    public Button resumeIncompleteButton;
    [Tooltip("Container/Card for resume button that is hidden if no incomplete assessment exists.")]
    public GameObject resumeIncompleteContainer;
    public Text resumeInfoText;
    public Text lastCompletedInfoText;

    [Header("UI – Selection Screen Texts (Dashboard)")]
    [Tooltip("Text on Selection Panel showing User Name.")]
    public Text selectionUserNameText;
    [Tooltip("Text on Selection Panel showing User ID.")]
    public Text selectionUserIdText;
    [Tooltip("Text on Selection Panel showing Last Assessment Date.")]
    public Text lastAssessmentDateText;
    [Tooltip("Text on Selection Panel showing Last Assessment Results (Score/Percentage).")]
    public Text lastResultsText;

    [Header("UI – Question Screen")]
    public Text  sectionText;
    public Text  titleText;
    public Text  instructionText;
    public Image questionImage;

    public Transform  answersPanel;
    public GameObject answerPrefab;

    public Text progressText;
    public Text scoreText;
    public bool showScoreDuringAssessment = false;

    [Header("UI – User & Session Info (Optional)")]
    public Text patientNameText;
    public Text patientIdText;
    public Text assessmentDateText;

    [Header("UI – Result Panel")]
    public GameObject resultPanel;
    public Text       finalScoreText;     
    public Text       finalScoreLabelText;
    public Text       resultDateText;
    [Tooltip("Button on Result Panel to finalize/close assessment and return to the Start Selection UI.")]
    public Button     resultDoneButton;

    [Header("Navigation Buttons")]
    public Button nextButton;
    public Button previousButton;
    public Button submitButton;
    public Button restartButton;
    [Tooltip("Optional button on question screen to return back to start selection menu.")]
    public Button exitToMenuButton;

    public enum AssessmentType { MiniBEST, FMAUE }

    [HideInInspector]
    public AssessmentType assessmentType;

    // -------------------------------------------------------------------------
    // Private state
    // -------------------------------------------------------------------------

    private List<Question> questions       = new List<Question>();
    private int            currentQuestion = 0;
    private List<int>      selectedScores  = new List<int>();
    private ToggleGroup    toggleGroup;
    private Sprite         dummySprite;

    // Assessment persistence & session tracking
    private UserAssessmentData userAssessmentData;
    private AssessmentSessionRecord currentSessionRecord;
    private string storageFolderPath;
    private static readonly object fileLock = new object();

    void Start()
    {
        // 1. Sync User Profile from Launcher or PatientDataManager if available
        SyncUserProfile();

        // 2. Setup JSON persistence folder
        EnsureStorageDirectory();

        // 3. Load dummy / placeholder sprite once
        dummySprite = LoadDummySprite();

        // 4. Auto-bind UI references if not set in Inspector
        AutoBindUI();

        // 5. Prepare toggle group for answer buttons
        if (answersPanel != null)
        {
            toggleGroup = answersPanel.GetComponent<ToggleGroup>();
            if (toggleGroup == null)
                toggleGroup = answersPanel.gameObject.AddComponent<ToggleGroup>();
            toggleGroup.allowSwitchOff = true;
        }

        // 6. Load user assessment history
        LoadUserAssessmentData();

        // 7. Wire all button listeners
        WireButtonListeners();

        // 8. Make sure result panel starts hidden
        if (resultPanel != null)
            resultPanel.SetActive(false);

        // 9. If Selection Panel is provided, show selection screen; otherwise start active assessment
        if (selectionPanel != null)
        {
            ShowSelectionMenu();
        }
        else
        {
            // Direct launch fallback for backwards compatibility
            StartAssessment(assessmentType, forceNew: false);
        }
    }

    private void AutoBindUI()
    {
        if (selectionPanel == null)
        {
            GameObject obj = GameObject.Find("SelectionPanel") ?? GameObject.Find("Selection Panel") ?? GameObject.Find("MenuPanel") ?? GameObject.Find("StartPanel");
            if (obj != null) selectionPanel = obj;
        }
        if (assessmentPanel == null)
        {
            GameObject obj = GameObject.Find("AssessmentPanel") ?? GameObject.Find("Assessment Panel") ?? GameObject.Find("QuestionPanel") ?? GameObject.Find("Question Panel");
            if (obj != null) assessmentPanel = obj;
        }
        if (startFmaueButton == null)
        {
            GameObject obj = GameObject.Find("FMAUE") ?? GameObject.Find("FMAUEButton") ?? GameObject.Find("StartFMAUE") ?? GameObject.Find("FMAUE Button");
            if (obj != null) startFmaueButton = obj.GetComponent<Button>();
        }
        if (startMiniBestButton == null)
        {
            GameObject obj = GameObject.Find("MINI BEST") ?? GameObject.Find("MiniBEST") ?? GameObject.Find("MiniBESTButton") ?? GameObject.Find("StartMiniBEST") ?? GameObject.Find("MiniBEST Button");
            if (obj != null) startMiniBestButton = obj.GetComponent<Button>();
        }
        if (resumeIncompleteButton == null)
        {
            GameObject obj = GameObject.Find("RESUME") ?? GameObject.Find("Resume") ?? GameObject.Find("ResumeButton") ?? GameObject.Find("ResumeAssessment") ?? GameObject.Find("Resume Incomplete");
            if (obj != null) resumeIncompleteButton = obj.GetComponent<Button>();
        }
        if (selectionUserNameText == null)
        {
            GameObject obj = GameObject.Find("UserName") ?? GameObject.Find("UIText/UserName");
            if (obj != null) selectionUserNameText = obj.GetComponent<Text>();
        }
        if (selectionUserIdText == null)
        {
            GameObject obj = GameObject.Find("UserID") ?? GameObject.Find("UIText/UserID");
            if (obj != null) selectionUserIdText = obj.GetComponent<Text>();
        }
        if (lastAssessmentDateText == null)
        {
            GameObject obj = GameObject.Find("Last Assessment Date") ?? GameObject.Find("LastAssessmentDate") ?? GameObject.Find("UIText/Last Assessment Date");
            if (obj != null) lastAssessmentDateText = obj.GetComponent<Text>();
        }
        if (lastResultsText == null)
        {
            GameObject obj = GameObject.Find("Last Results") ?? GameObject.Find("LastResults") ?? GameObject.Find("UIText/Last Results");
            if (obj != null) lastResultsText = obj.GetComponent<Text>();
        }
        if (resultDoneButton == null && resultPanel != null)
        {
            // Look for Submit / Close / Done button inside Result Panel
            Button[] btns = resultPanel.GetComponentsInChildren<Button>(true);
            foreach (var b in btns)
            {
                string n = b.gameObject.name.ToLower();
                if (n.Contains("submit") || n.Contains("done") || n.Contains("close") || n.Contains("ok") || n.Contains("menu") || n.Contains("retry"))
                {
                    resultDoneButton = b;
                    break;
                }
            }
        }
    }

    private void WireButtonListeners()
    {
        if (startFmaueButton != null)
        {
            startFmaueButton.onClick.RemoveAllListeners();
            startFmaueButton.onClick.AddListener(StartFMAUEAssessment);
        }

        if (startMiniBestButton != null)
        {
            startMiniBestButton.onClick.RemoveAllListeners();
            startMiniBestButton.onClick.AddListener(StartMiniBESTAssessment);
        }

        if (resumeIncompleteButton != null)
        {
            resumeIncompleteButton.onClick.RemoveAllListeners();
            resumeIncompleteButton.onClick.AddListener(ResumeIncompleteAssessment);
        }

        if (resultDoneButton != null)
        {
            resultDoneButton.onClick.RemoveAllListeners();
            resultDoneButton.onClick.AddListener(CloseResultAndShowMenu);
        }

        if (nextButton != null)
        {
            nextButton.onClick.RemoveAllListeners();
            nextButton.onClick.AddListener(NextQuestion);
        }

        if (previousButton != null)
        {
            previousButton.onClick.RemoveAllListeners();
            previousButton.onClick.AddListener(PreviousQuestion);
        }

        if (submitButton != null)
        {
            submitButton.onClick.RemoveAllListeners();
            submitButton.onClick.AddListener(Submit);
        }

        if (restartButton != null)
        {
            restartButton.onClick.RemoveAllListeners();
            restartButton.onClick.AddListener(() => StartNewAssessment(true));
        }

        if (exitToMenuButton != null)
        {
            exitToMenuButton.onClick.RemoveAllListeners();
            exitToMenuButton.onClick.AddListener(ExitAssessmentToMenu);
        }
    }

    // -------------------------------------------------------------------------
    // Selection Menu / Dashboard
    // -------------------------------------------------------------------------

    public void ShowSelectionMenu()
    {
        LoadUserAssessmentData();

        if (selectionPanel != null)
            selectionPanel.SetActive(true);

        if (assessmentPanel != null)
            assessmentPanel.SetActive(false);

        if (resultPanel != null)
            resultPanel.SetActive(false);

        RefreshSelectionMenuUI();
    }

    public void RefreshSelectionMenuUI()
    {
        var incomplete = GetLatestIncompleteSession();

        if (incomplete != null)
        {
            if (resumeIncompleteContainer != null)
                resumeIncompleteContainer.SetActive(true);

            if (resumeIncompleteButton != null)
            {
                resumeIncompleteButton.gameObject.SetActive(true);
                resumeIncompleteButton.interactable = true;
            }

            if (resumeInfoText != null)
            {
                int qNum = incomplete.currentQuestionIndex + 1;
                int maxQ = (incomplete.selectedScores != null && incomplete.selectedScores.Count > 0) ? incomplete.selectedScores.Count : (incomplete.assessmentType == "MiniBEST" ? 14 : 64);
                resumeInfoText.text = $"Resume {incomplete.assessmentType}\nQuestion: {qNum} / {maxQ} | Score: {incomplete.totalScore}\nLast Active: {incomplete.lastUpdatedDateTime}";
            }
        }
        else
        {
            if (resumeIncompleteContainer != null)
                resumeIncompleteContainer.SetActive(false);

            if (resumeIncompleteButton != null)
            {
                resumeIncompleteButton.interactable = false;
            }

            if (resumeInfoText != null)
            {
                resumeInfoText.text = "No in-progress assessment.";
            }
        }

        if (lastCompletedInfoText != null)
        {
            var lastCompleted = GetLatestCompletedSession();
            if (lastCompleted != null)
            {
                lastCompletedInfoText.text = $"Last Assessment: {lastCompleted.assessmentType}\nScore: {lastCompleted.totalScore} / {lastCompleted.maxScore} ({lastCompleted.percentage:F1}%)\nDate: {lastCompleted.completedDateTime}";
            }
            else
            {
                lastCompletedInfoText.text = "No completed assessments yet.";
            }
        }

        UpdateUserInfoUI();
    }

    public AssessmentSessionRecord GetLatestIncompleteSession()
    {
        if (userAssessmentData == null || userAssessmentData.assessments == null) return null;

        for (int i = userAssessmentData.assessments.Count - 1; i >= 0; i--)
        {
            var s = userAssessmentData.assessments[i];
            if (s != null && !s.isCompleted)
            {
                return s;
            }
        }
        return null;
    }

    public AssessmentSessionRecord GetLatestCompletedSession()
    {
        if (userAssessmentData == null || userAssessmentData.assessments == null) return null;

        for (int i = userAssessmentData.assessments.Count - 1; i >= 0; i--)
        {
            var s = userAssessmentData.assessments[i];
            if (s != null && s.isCompleted)
            {
                return s;
            }
        }
        return null;
    }

    // -------------------------------------------------------------------------
    // Assessment Launchers
    // -------------------------------------------------------------------------

    public void StartFMAUEAssessment()
    {
        StartAssessment(AssessmentType.FMAUE, forceNew: false);
    }

    public void StartMiniBESTAssessment()
    {
        StartAssessment(AssessmentType.MiniBEST, forceNew: false);
    }

    public void ResumeIncompleteAssessment()
    {
        var incomplete = GetLatestIncompleteSession();
        if (incomplete != null)
        {
            if (Enum.TryParse(incomplete.assessmentType, out AssessmentType parsedType))
            {
                assessmentType = parsedType;
            }
            StartAssessment(assessmentType, forceNew: false);
        }
        else
        {
            // Fallback: start MiniBEST if no incomplete session
            StartMiniBESTAssessment();
        }
    }

    public void StartAssessment(AssessmentType type, bool forceNew = false)
    {
        assessmentType = type;

        // 1. Build questions in current language
        BuildQuestions();

        // 2. Attach sprites
        AssignImages();

        // 3. Switch active panels
        if (selectionPanel != null)
            selectionPanel.SetActive(false);

        if (assessmentPanel != null)
            assessmentPanel.SetActive(true);

        if (resultPanel != null)
            resultPanel.SetActive(false);

        // 4. Initialize or resume session
        if (forceNew)
        {
            StartNewAssessment(true);
        }
        else
        {
            InitializeAssessmentSession();
        }

        // 5. Update header info & display active question
        UpdateUserInfoUI();
        LoadQuestion();
    }

    public void ExitAssessmentToMenu()
    {
        SaveSessionProgress();
        ShowSelectionMenu();
    }

    public void CloseResultAndShowMenu()
    {
        if (resultPanel != null)
            resultPanel.SetActive(false);

        if (assessmentPanel != null)
            assessmentPanel.SetActive(false);

        ShowSelectionMenu();
    }

    private void BuildQuestions()
    {
        switch (assessmentType)
        {
            case AssessmentType.MiniBEST:
                questions = MiniBESTAssessment.CreateQuestions();
                break;

            case AssessmentType.FMAUE:
                questions = FMAUEAssessment.CreateQuestions();
                break;
        }
    }

    // -------------------------------------------------------------------------
    // User Profile Sync & JSON Persistence
    // -------------------------------------------------------------------------

    private void SyncUserProfile()
    {
        if (NeuroRehabLauncher.Instance != null)
        {
            if (!string.IsNullOrEmpty(NeuroRehabLauncher.Instance.userId))
                targetUserId = NeuroRehabLauncher.Instance.userId;
            if (!string.IsNullOrEmpty(NeuroRehabLauncher.Instance.userName))
                targetUserName = NeuroRehabLauncher.Instance.userName;
            if (!string.IsNullOrEmpty(NeuroRehabLauncher.Instance.AppLanguage))
                AppLanguage = NeuroRehabLauncher.Instance.AppLanguage;
        }
        else if (PatientDataManager.Instance != null)
        {
            var active = PatientDataManager.Instance.GetActiveProfile();
            if (active != null)
            {
                if (!string.IsNullOrEmpty(active.userId))
                    targetUserId = active.userId;
                if (!string.IsNullOrEmpty(active.patientName))
                    targetUserName = active.patientName;
                if (!string.IsNullOrEmpty(active.language))
                    AppLanguage = active.language;
            }
        }

        LocalisationManager.SetLanguage(AppLanguage);
    }

    private void EnsureStorageDirectory()
    {
        if (string.IsNullOrEmpty(storageFolderPath))
        {
            storageFolderPath = Path.Combine(Application.persistentDataPath, "AssessmentData");
            if (!Directory.Exists(storageFolderPath))
            {
                Directory.CreateDirectory(storageFolderPath);
            }
        }
    }

    public string GetAssessmentJsonPath(string uId)
    {
        EnsureStorageDirectory();
        return Path.Combine(storageFolderPath, $"{uId}_assessments.json");
    }

    public void LoadUserAssessmentData()
    {
        string filePath = GetAssessmentJsonPath(targetUserId);
        lock (fileLock)
        {
            if (File.Exists(filePath))
            {
                try
                {
                    string json = File.ReadAllText(filePath);
                    userAssessmentData = UserAssessmentData.FromJson(json);
                }
                catch (Exception ex)
                {
                    Debug.LogWarning($"[ClinicalAssessmentManager] Error reading assessment JSON for {targetUserId}: {ex.Message}");
                }
            }
        }

        if (userAssessmentData == null)
        {
            userAssessmentData = new UserAssessmentData(targetUserId, targetUserName);
        }
        else
        {
            userAssessmentData.userId = targetUserId;
            if (!string.IsNullOrEmpty(targetUserName))
                userAssessmentData.userName = targetUserName;
        }
    }

    public void SaveUserAssessmentData()
    {
        if (userAssessmentData == null) return;

        EnsureStorageDirectory();
        string filePath = GetAssessmentJsonPath(targetUserId);
        string json = userAssessmentData.ToJson(true);

        lock (fileLock)
        {
            try
            {
                File.WriteAllText(filePath, json);
                Debug.Log($"[ClinicalAssessmentManager] Saved assessment data to: {filePath}");
            }
            catch (Exception ex)
            {
                Debug.LogError($"[ClinicalAssessmentManager] Error writing assessment JSON for {targetUserId}: {ex.Message}");
            }
        }
    }

    private void InitializeAssessmentSession()
    {
        LoadUserAssessmentData();

        string currentTypeName = assessmentType.ToString();

        // Check if there is an existing in-progress (uncompleted) assessment of this type
        AssessmentSessionRecord inProgressSession = null;
        if (userAssessmentData.assessments != null && userAssessmentData.assessments.Count > 0)
        {
            for (int i = userAssessmentData.assessments.Count - 1; i >= 0; i--)
            {
                var session = userAssessmentData.assessments[i];
                if (session != null && session.assessmentType == currentTypeName && !session.isCompleted)
                {
                    inProgressSession = session;
                    break;
                }
            }
        }

        if (inProgressSession != null)
        {
            // Resume in-progress assessment
            currentSessionRecord = inProgressSession;
            currentQuestion = Mathf.Clamp(inProgressSession.currentQuestionIndex, 0, questions.Count - 1);

            selectedScores.Clear();
            for (int i = 0; i < questions.Count; i++)
            {
                if (inProgressSession.selectedScores != null && i < inProgressSession.selectedScores.Count)
                {
                    selectedScores.Add(inProgressSession.selectedScores[i]);
                }
                else
                {
                    selectedScores.Add(-1);
                }
            }

            Debug.Log($"[ClinicalAssessmentManager] Resuming in-progress {assessmentType} assessment for {targetUserName} (ID: {targetUserId}) at Question {currentQuestion + 1}/{questions.Count}");
        }
        else
        {
            // Start fresh session
            currentSessionRecord = new AssessmentSessionRecord(currentTypeName, questions.Count);
            if (userAssessmentData.assessments == null)
                userAssessmentData.assessments = new List<AssessmentSessionRecord>();

            userAssessmentData.assessments.Add(currentSessionRecord);

            currentQuestion = 0;
            selectedScores.Clear();
            for (int i = 0; i < questions.Count; i++)
                selectedScores.Add(-1);

            SaveUserAssessmentData();
            Debug.Log($"[ClinicalAssessmentManager] Started new {assessmentType} assessment session ({currentSessionRecord.sessionId}) for {targetUserName} (ID: {targetUserId}) on {currentSessionRecord.startDateTime}");
        }
    }

    public void StartNewAssessment(bool forceFresh = true)
    {
        if (forceFresh && currentSessionRecord != null && !currentSessionRecord.isCompleted)
        {
            currentSessionRecord.isCompleted = true;
            currentSessionRecord.completedDateTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + " (Restarted)";
        }

        currentSessionRecord = new AssessmentSessionRecord(assessmentType.ToString(), questions.Count);
        if (userAssessmentData.assessments == null)
            userAssessmentData.assessments = new List<AssessmentSessionRecord>();

        userAssessmentData.assessments.Add(currentSessionRecord);

        currentQuestion = 0;
        selectedScores.Clear();
        for (int i = 0; i < questions.Count; i++)
            selectedScores.Add(-1);

        SaveUserAssessmentData();

        if (resultPanel != null)
            resultPanel.SetActive(false);

        LoadQuestion();
        UpdateUserInfoUI();
    }

    public void SetUser(string newUserId, string newUserName)
    {
        targetUserId = newUserId;
        targetUserName = newUserName;
        LoadUserAssessmentData();
        if (selectionPanel != null && selectionPanel.activeSelf)
        {
            RefreshSelectionMenuUI();
        }
        else
        {
            InitializeAssessmentSession();
            UpdateUserInfoUI();
            LoadQuestion();
        }
    }

    public void SetLanguage(string lang)
    {
        if (string.IsNullOrEmpty(lang)) return;
        AppLanguage = lang;
        LocalisationManager.SetLanguage(lang);
        BuildQuestions();
        AssignImages();
        if (assessmentPanel != null && assessmentPanel.activeSelf)
        {
            LoadQuestion();
        }
        else if (selectionPanel != null && selectionPanel.activeSelf)
        {
            RefreshSelectionMenuUI();
        }
    }

    private void SaveSessionProgress()
    {
        if (currentSessionRecord == null) return;

        currentSessionRecord.currentQuestionIndex = currentQuestion;
        currentSessionRecord.selectedScores = new List<int>(selectedScores);
        currentSessionRecord.lastUpdatedDateTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
        currentSessionRecord.totalScore = CalculateTotalScore();

        SaveUserAssessmentData();
    }

    private int CalculateTotalScore()
    {
        int total = 0;
        foreach (int score in selectedScores)
            if (score >= 0) total += score;
        return total;
    }

    private int CalculateMaxPossibleScore()
    {
        int max = 0;
        foreach (Question q in questions)
        {
            int highest = 0;
            foreach (Answer a in q.Answers)
                if (a.Score > highest) highest = a.Score;
            max += highest;
        }
        return max;
    }

    // -------------------------------------------------------------------------
    // Image helpers
    // -------------------------------------------------------------------------

    private void AssignImages()
    {
        string subfolder = assessmentType.ToString(); // "MiniBEST" or "FMAUE"

        for (int i = 0; i < questions.Count; i++)
        {
            string path   = $"{ImageBasePath}/{subfolder}/Q{i + 1}";
            Sprite sprite = Resources.Load<Sprite>(path);
            if (sprite == null)
            {
                sprite = Resources.Load<Sprite>($"Localisation/{ImageBasePath}/{subfolder}/Q{i + 1}");
            }
            questions[i].Image = (sprite != null) ? sprite : dummySprite;
        }
    }

    private Sprite LoadDummySprite()
    {
        Sprite loaded = Resources.Load<Sprite>(DummyImagePath);
        if (loaded == null)
        {
            loaded = Resources.Load<Sprite>($"Localisation/{DummyImagePath}");
        }
        if (loaded != null) return loaded;

        // Fallback: solid grey 128×128 generated at runtime
        Texture2D tex    = new Texture2D(128, 128);
        Color     grey   = new Color(0.75f, 0.75f, 0.75f);
        Color[]   pixels = new Color[128 * 128];
        for (int i = 0; i < pixels.Length; i++) pixels[i] = grey;
        tex.SetPixels(pixels);
        tex.Apply();

        return Sprite.Create(tex,
            new Rect(0, 0, tex.width, tex.height),
            new Vector2(0.5f, 0.5f));
    }

    // -------------------------------------------------------------------------
    // Question display
    // -------------------------------------------------------------------------

    void LoadQuestion()
    {
        if (questions == null || questions.Count == 0) return;

        Question q = questions[currentQuestion];

        if (sectionText != null)     sectionText.text     = q.Section;
        if (titleText != null)       titleText.text       = q.Title;
        if (instructionText != null) instructionText.text = q.Instruction;

        if (questionImage != null)
        {
            questionImage.sprite = q.Image;
            questionImage.gameObject.SetActive(true);
        }

        if (progressText != null)
        {
            progressText.text = "Question " + (currentQuestion + 1) + " / " + questions.Count;
        }

        BuildAnswers(q);

        UpdateNavigationButtons();

        UpdateScore();
    }

    private void UpdateNavigationButtons()
    {
        // Back button: visible on every question except the first
        if (previousButton != null)
            previousButton.gameObject.SetActive(currentQuestion > 0);

        // On the last question: hide Next, show Submit
        // On all other questions: show Next, hide Submit
        bool isLast = currentQuestion == questions.Count - 1;
        if (nextButton != null)
            nextButton.gameObject.SetActive(!isLast);
        if (submitButton != null)
            submitButton.gameObject.SetActive(isLast);

        // Require an option to be selected before Next/Submit is enabled
        bool hasSelection = (currentQuestion < selectedScores.Count) && (selectedScores[currentQuestion] >= 0);
        if (nextButton != null)
            nextButton.interactable = hasSelection;
        if (submitButton != null)
            submitButton.interactable = hasSelection;
    }

    void BuildAnswers(Question q)
    {
        if (answersPanel == null) return;

        foreach (Transform child in answersPanel)
            Destroy(child.gameObject);

        if (toggleGroup != null)
            toggleGroup.SetAllTogglesOff();

        List<Toggle> created = new List<Toggle>();

        for (int i = 0; i < q.Answers.Count; i++)
        {
            Answer answer = q.Answers[i];

            GameObject go     = Instantiate(answerPrefab, answersPanel);
            Toggle     toggle = go.GetComponentInChildren<Toggle>();
            Text       txt    = go.GetComponentInChildren<Text>();

            // ONLY show the answer description text, without score numbers (2, 0, 1) prepended
            if (txt != null) txt.text = answer.Text;
            if (toggle != null) toggle.group = toggleGroup;

            int score = answer.Score;

            if (toggle != null)
            {
                toggle.onValueChanged.AddListener(delegate (bool on)
                {
                    if (on)
                    {
                        selectedScores[currentQuestion] = score;
                        UpdateScore();
                        SaveSessionProgress();
                        UpdateNavigationButtons();
                    }
                });

                created.Add(toggle);
            }
        }

        // Restore previously saved answer for this question
        int saved = (currentQuestion < selectedScores.Count) ? selectedScores[currentQuestion] : -1;
        if (saved != -1)
        {
            for (int i = 0; i < q.Answers.Count; i++)
            {
                if (q.Answers[i].Score == saved && i < created.Count)
                {
                    created[i].SetIsOnWithoutNotify(true);
                    break;
                }
            }
        }
    }

    void UpdateScore()
    {
        int total = CalculateTotalScore();

        if (scoreText != null)
        {
            if (showScoreDuringAssessment)
            {
                scoreText.gameObject.SetActive(true);
                scoreText.text = "Score : " + total;
            }
            else
            {
                scoreText.gameObject.SetActive(false);
            }
        }
    }

    void UpdateUserInfoUI()
    {
        // 1. User Name
        if (selectionUserNameText != null)
            selectionUserNameText.text = targetUserName;
        if (patientNameText != null)
            patientNameText.text = targetUserName;

        // 2. User ID
        if (selectionUserIdText != null)
            selectionUserIdText.text = $"ID: {targetUserId}";
        if (patientIdText != null)
            patientIdText.text = $"ID: {targetUserId}";

        // 3. Current active assessment date (for in-test header)
        if (assessmentDateText != null)
            assessmentDateText.text = currentSessionRecord != null ? currentSessionRecord.date : DateTime.Now.ToString("yyyy-MM-dd");

        // 4. Last Assessment Date & Last Results (for Selection Panel)
        var lastCompleted = GetLatestCompletedSession();
        var lastIncomplete = GetLatestIncompleteSession();

        if (lastAssessmentDateText != null)
        {
            if (lastCompleted != null && !string.IsNullOrEmpty(lastCompleted.date))
            {
                lastAssessmentDateText.text = $"{lastCompleted.date}";
            }
            else if (lastIncomplete != null && !string.IsNullOrEmpty(lastIncomplete.date))
            {
                lastAssessmentDateText.text = $"{lastIncomplete.date}";
            }
            else
            {
                lastAssessmentDateText.text = DateTime.Now.ToString("yyyy-MM-dd");
            }
        }

        if (lastResultsText != null)
        {
            if (lastCompleted != null)
            {
                lastResultsText.text = $"{lastCompleted.assessmentType}: {lastCompleted.totalScore} / {lastCompleted.maxScore} ({lastCompleted.percentage:F1}%)";
            }
            else if (lastIncomplete != null)
            {
                lastResultsText.text = $"{lastIncomplete.assessmentType}: In Progress (Q{lastIncomplete.currentQuestionIndex + 1})";
            }
            else
            {
                lastResultsText.text = "No Previous Results";
            }
        }
    }

    // -------------------------------------------------------------------------
    // Navigation
    // -------------------------------------------------------------------------

    public void NextQuestion()
    {
        if (currentQuestion < selectedScores.Count && selectedScores[currentQuestion] < 0)
        {
            Debug.LogWarning("[ClinicalAssessmentManager] Please select an option before proceeding to the next question.");
            return;
        }

        if (currentQuestion >= questions.Count - 1) return;
        currentQuestion++;
        SaveSessionProgress();
        LoadQuestion();
    }

    public void PreviousQuestion()
    {
        if (currentQuestion <= 0) return;
        currentQuestion--;
        SaveSessionProgress();
        LoadQuestion();
    }

    // -------------------------------------------------------------------------
    // Submit – complete assessment & show result panel
    // -------------------------------------------------------------------------

    public void Submit()
    {
        if (currentQuestion < selectedScores.Count && selectedScores[currentQuestion] < 0)
        {
            Debug.LogWarning("[ClinicalAssessmentManager] Please select an option before submitting.");
            return;
        }

        int total = CalculateTotalScore();
        int max = CalculateMaxPossibleScore();
        float percent = max > 0 ? ((float)total / (float)max) * 100f : 0f;

        DateTime now = DateTime.Now;
        string completionTime = now.ToString("yyyy-MM-dd HH:mm:ss");

        // Finalize current session record
        if (currentSessionRecord != null)
        {
            currentSessionRecord.isCompleted = true;
            currentSessionRecord.completedDateTime = completionTime;
            currentSessionRecord.lastUpdatedDateTime = completionTime;
            currentSessionRecord.currentQuestionIndex = questions.Count - 1;
            currentSessionRecord.selectedScores = new List<int>(selectedScores);
            currentSessionRecord.totalScore = total;
            currentSessionRecord.maxScore = max;
            currentSessionRecord.percentage = percent;

            // Record full detailed question breakdown
            currentSessionRecord.questionDetails = new List<AssessmentQuestionDetail>();
            for (int i = 0; i < questions.Count; i++)
            {
                var detail = new AssessmentQuestionDetail();
                detail.questionIndex = i;
                detail.section = questions[i].Section;
                detail.title = questions[i].Title;
                detail.selectedScore = (i < selectedScores.Count) ? selectedScores[i] : -1;

                if (detail.selectedScore >= 0)
                {
                    var ans = questions[i].Answers.Find(a => a.Score == detail.selectedScore);
                    detail.selectedAnswerText = ans != null ? ans.Text : "";
                }
                else
                {
                    detail.selectedAnswerText = "Unanswered";
                }
                currentSessionRecord.questionDetails.Add(detail);
            }

            SaveUserAssessmentData();
        }

        Debug.Log($"[ClinicalAssessmentManager] Assessment Complete ({assessmentType}) for {targetUserName} (ID: {targetUserId})");
        Debug.Log($"Final Score: {total} / {max} ({percent:F1}%) on {completionTime}");

        if (resultPanel != null)
        {
            resultPanel.SetActive(true);

            if (finalScoreText != null)
                finalScoreText.text = $"{total} / {max} ({percent:F1}%)";

            if (finalScoreLabelText != null)
                finalScoreLabelText.text = $"{assessmentType} Assessment Score";

            if (resultDateText != null)
                resultDateText.text = completionTime;
        }
    }

    // -------------------------------------------------------------------------
    // Load an arbitrary question list at runtime
    // -------------------------------------------------------------------------

    public void LoadAssessment(List<Question> assessmentQuestions)
    {
        questions = assessmentQuestions;

        selectedScores.Clear();
        for (int i = 0; i < questions.Count; i++)
            selectedScores.Add(-1);

        currentQuestion = 0;

        if (resultPanel != null)
            resultPanel.SetActive(false);

        LoadQuestion();
    }

    public UserAssessmentData GetUserAssessmentData()
    {
        if (userAssessmentData == null)
            LoadUserAssessmentData();
        return userAssessmentData;
    }
}
