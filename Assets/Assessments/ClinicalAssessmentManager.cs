using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

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
    // Place question images inside:
    //   Assets/Resources/AssessmentImages/MiniBEST/
    //   Assets/Resources/AssessmentImages/FMAUE/
    //
    // File naming convention (must match exactly, case-sensitive on some platforms):
    //   MiniBEST  → Q1.png, Q2.png … Q14.png
    //   FMAUE     → Q1.png, Q2.png … QN.png
    //
    // A dummy / placeholder image is loaded from:
    //   Assets/Resources/AssessmentImages/DummyImage.png
    // If that file is also missing, a plain grey texture is generated at runtime.
    // -------------------------------------------------------------------------

    private const string ImageBasePath  = "AssessmentImages";
    private const string DummyImagePath = "AssessmentImages/DummyImage";

    [Header("UI – Question Screen")]
    public Text  sectionText;
    public Text  titleText;
    public Text  instructionText;
    public Image questionImage;

    public Transform  answersPanel;
    public GameObject answerPrefab;

    public Text progressText;
    public Text scoreText;

    [Header("UI – Result Panel")]
    public GameObject resultPanel;
    public Text       finalScoreText;     
    public Text       finalScoreLabelText;

    [Header("Buttons")]
    public Button nextButton;
    public Button previousButton;
    public Button submitButton;

    public enum AssessmentType { MiniBEST, FMAUE }

    [Header("Assessment")]
    public AssessmentType assessmentType;

    // -------------------------------------------------------------------------
    // Private state
    // -------------------------------------------------------------------------

    private List<Question> questions       = new List<Question>();
    private int            currentQuestion = 0;
    private List<int>      selectedScores  = new List<int>();
    private ToggleGroup    toggleGroup;
    private Sprite         dummySprite;

    void Start()
    {
        // 1. Load dummy / placeholder sprite once
        dummySprite = LoadDummySprite();

        // 2. Build question list
        switch (assessmentType)
        {
            case AssessmentType.MiniBEST:
                questions = MiniBESTAssessment.CreateQuestions();
                break;

            case AssessmentType.FMAUE:
                questions = FMAUEAssessment.CreateQuestions();
                break;
        }

        // 3. Attach sprites from Resources folder
        AssignImages();

        // 4. Prepare toggle group
        toggleGroup = answersPanel.GetComponent<ToggleGroup>();
        if (toggleGroup == null)
            toggleGroup = answersPanel.gameObject.AddComponent<ToggleGroup>();
        toggleGroup.allowSwitchOff = true;

        // 5. Reset scores
        selectedScores.Clear();
        for (int i = 0; i < questions.Count; i++)
            selectedScores.Add(-1);

        // 6. Wire buttons
        nextButton.onClick.AddListener(NextQuestion);
        previousButton.onClick.AddListener(PreviousQuestion);
        submitButton.onClick.AddListener(Submit);

        // 7. Make sure result panel starts hidden
        if (resultPanel != null)
            resultPanel.SetActive(false);

        LoadQuestion();
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
            questions[i].Image = (sprite != null) ? sprite : dummySprite;
        }
    }

    private Sprite LoadDummySprite()
    {
        Sprite loaded = Resources.Load<Sprite>(DummyImagePath);
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
        Question q = questions[currentQuestion];

        sectionText.text     = q.Section;
        titleText.text       = q.Title;
        instructionText.text = q.Instruction;

        if (questionImage != null)
        {
            questionImage.sprite = q.Image;
            questionImage.gameObject.SetActive(true);
        }

        progressText.text =
            "Question " + (currentQuestion + 1) + " / " + questions.Count;

        BuildAnswers(q);

        // Back button: visible on every question except the first
        previousButton.gameObject.SetActive(currentQuestion > 0);

        // On the last question: hide Next, show Submit
        // On all other questions: show Next, hide Submit
        bool isLast = currentQuestion == questions.Count - 1;
        nextButton.gameObject.SetActive(!isLast);
        submitButton.gameObject.SetActive(isLast);

        UpdateScore();
    }

    void BuildAnswers(Question q)
    {
        foreach (Transform child in answersPanel)
            Destroy(child.gameObject);

        toggleGroup.SetAllTogglesOff();

        List<Toggle> created = new List<Toggle>();

        for (int i = 0; i < q.Answers.Count; i++)
        {
            Answer answer = q.Answers[i];

            GameObject go     = Instantiate(answerPrefab, answersPanel);
            Toggle     toggle = go.GetComponentInChildren<Toggle>();
            Text       txt    = go.GetComponentInChildren<Text>();

            txt.text     = answer.Score + " - " + answer.Text;
            toggle.group = toggleGroup;

            int score = answer.Score;

            toggle.onValueChanged.AddListener(delegate (bool on)
            {
                if (on)
                {
                    selectedScores[currentQuestion] = score;
                    UpdateScore();
                }
            });

            created.Add(toggle);
        }

        // Restore previously saved answer for this question
        int saved = selectedScores[currentQuestion];
        if (saved != -1)
        {
            for (int i = 0; i < q.Answers.Count; i++)
            {
                if (q.Answers[i].Score == saved)
                {
                    created[i].SetIsOnWithoutNotify(true);
                    break;
                }
            }
        }
    }

    void UpdateScore()
    {
        int total = 0;
        foreach (int score in selectedScores)
            if (score >= 0) total += score;

        if (scoreText != null)
            scoreText.text = "Score : " + total;
    }

    // -------------------------------------------------------------------------
    // Navigation
    // -------------------------------------------------------------------------

    public void NextQuestion()
    {
        if (currentQuestion >= questions.Count - 1) return;
        currentQuestion++;
        LoadQuestion();
    }

    public void PreviousQuestion()
    {
        if (currentQuestion <= 0) return;
        currentQuestion--;
        LoadQuestion();
    }

    // -------------------------------------------------------------------------
    // Submit – show result panel
    // -------------------------------------------------------------------------

    public void Submit()
    {
        // Calculate final score (unanswered questions count as 0)
        int total    = 0;
        int maxScore = 0;

        foreach (int score in selectedScores)
            if (score >= 0) total += score;

        // Calculate the maximum possible score for this assessment
        foreach (Question q in questions)
            foreach (Answer a in q.Answers)
                if (a.Score > maxScore) maxScore += 0; // we pick the highest per question below

        // Max score = sum of highest answer score per question
        int max = 0;
        foreach (Question q in questions)
        {
            int highest = 0;
            foreach (Answer a in q.Answers)
                if (a.Score > highest) highest = a.Score;
            max += highest;
        }

        Debug.Log("Assessment Complete – " + assessmentType);
        Debug.Log("Final Score: " + total + " / " + max);

        if (resultPanel != null)
        {
            resultPanel.SetActive(true);

            if (finalScoreText != null)
                finalScoreText.text = total + " / " + max;

            if (finalScoreLabelText != null)
                finalScoreLabelText.text = assessmentType.ToString() + " Assessment Score";
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
}
