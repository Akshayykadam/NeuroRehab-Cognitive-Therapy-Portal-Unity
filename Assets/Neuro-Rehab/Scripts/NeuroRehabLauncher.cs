using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

namespace NeuroRehab
{
    public class NeuroRehabLauncher : MonoBehaviour
    {
        public string targetUserName = "";

        public string targetUserId = "";

        public string userName { get => targetUserName; set => targetUserName = value; }
        public string userId { get => targetUserId; set => targetUserId = value; }

        public int initialXP = 0;

        public static NeuroRehabLauncher instance;
        public static NeuroRehabLauncher Instance => instance;

        public string AppLanguage = "";

        public string targetLanguage { get => AppLanguage; set => AppLanguage = value; }

        public Button playButton, backButton;
        public Text usernameText;
        public Text idText;
        public Text scoreText;
        public Text completedText;
        public Text accuracyText;
        public Text progressText;
        public Text lastActiveText;

        private NeuroRehabWebViewManager webViewManager;

        private void Awake()
        {
            instance = this;
        }

        private void OnEnable()
        {
            BindUIReferences();
            if (PatientDataManager.Instance != null)
            {
                PatientDataManager.Instance.OnPatientDataUpdated -= OnDataUpdated;
                PatientDataManager.Instance.OnPatientDataUpdated += OnDataUpdated;
            }
            UpdateUI();
        }

        private void OnApplicationFocus(bool hasFocus)
        {
            if (hasFocus)
            {
                UpdateUI();
            }
        }

        private void Start()
        {
            // 1. Ensure Managers exist
            if (PatientDataManager.Instance == null)
            {
                GameObject dataObj = new GameObject("[PatientDataManager]");
                dataObj.AddComponent<PatientDataManager>();
            }

            webViewManager = FindObjectOfType<NeuroRehabWebViewManager>();
            if (webViewManager == null)
            {
                GameObject webObj = new GameObject("NeuroRehabWebViewManager");
                webViewManager = webObj.AddComponent<NeuroRehabWebViewManager>();
            }

            // 2. Bind UI & Button listeners
            BindUIReferences();

            // 3. Refresh Native Unity UI
            UpdateUI();
        }

        public void BindUIReferences()
        {
            // Auto-find Buttons if references were lost
            if (playButton == null)
            {
                GameObject obj = GameObject.Find("PlayButton") ?? GameObject.Find("Play") ?? GameObject.Find("Play Button");
                if (obj != null) playButton = obj.GetComponent<Button>();
            }
            if (backButton == null)
            {
                GameObject obj = GameObject.Find("BackButton") ?? GameObject.Find("Back") ?? GameObject.Find("Back Button");
                if (obj != null) backButton = obj.GetComponent<Button>();
            }

            // Auto-find Text components by name if not linked in Inspector
            if (usernameText == null) { GameObject obj = GameObject.Find("UserName"); if (obj != null) usernameText = obj.GetComponent<Text>(); }
            if (idText == null) { GameObject obj = GameObject.Find("UserID"); if (obj != null) idText = obj.GetComponent<Text>(); }
            if (scoreText == null) { GameObject obj = GameObject.Find("Score"); if (obj != null) scoreText = obj.GetComponent<Text>(); }
            if (completedText == null) { GameObject obj = GameObject.Find("Completed"); if (obj != null) completedText = obj.GetComponent<Text>(); }
            if (accuracyText == null) { GameObject obj = GameObject.Find("Accuracy"); if (obj != null) accuracyText = obj.GetComponent<Text>(); }
            if (progressText == null) { GameObject obj = GameObject.Find("Progress"); if (obj != null) progressText = obj.GetComponent<Text>(); }
            if (lastActiveText == null) { GameObject obj = GameObject.Find("Last Active"); if (obj != null) lastActiveText = obj.GetComponent<Text>(); }

            // Connect button listeners cleanly
            if (playButton != null)
            {
                playButton.onClick.RemoveAllListeners();
                playButton.onClick.AddListener(LaunchSession);
            }
            if (backButton != null)
            {
                backButton.onClick.RemoveAllListeners();
                backButton.onClick.AddListener(OnClickBackButton);
            }
        }

        public void OnClickBackButton()
        {
            SceneManager.LoadScene("NeuroMenu");
        }

        private bool isUpdatingUI = false;

        public void UpdateUI()
        {
            if (isUpdatingUI) return;
            isUpdatingUI = true;

            try
            {
                string uid = !string.IsNullOrEmpty(targetUserId) ? targetUserId : "1001";
                string uname = !string.IsNullOrEmpty(targetUserName) ? targetUserName : "Patient Name";

                // Always load latest profile from disk or manager
                PatientProfile profile = null;
                if (PatientDataManager.Instance != null)
                {
                    profile = PatientDataManager.Instance.ReloadProfile(uid);
                    if (profile == null)
                    {
                        profile = PatientDataManager.Instance.GetOrCreateProfile(uid, uname, initialXP);
                    }
                }
                
                if (profile == null)
                {
                    profile = new PatientProfile(uid, uname, initialXP);
                }

                BindUIReferences();

                if (usernameText != null) usernameText.text = profile.patientName;
                if (idText != null) idText.text = $"ID: {profile.userId}";
                if (scoreText != null) scoreText.text = $"{profile.totalXP} Score";
                if (completedText != null) completedText.text = $"{profile.totalCompletedExercises} / 16 Practiced";
                if (accuracyText != null) accuracyText.text = $"{profile.averageAccuracy}% Accuracy";

                if (progressText != null)
                {
                    int progressPercent = profile.GetOverallProgressPercentage();
                    progressText.text = $"{progressPercent}% Progress";
                }

                if (lastActiveText != null)
                {
                    string dateStr = !string.IsNullOrEmpty(profile.lastActiveDate) ? profile.lastActiveDate : System.DateTime.Now.ToString("yyyy-MM-dd");
                    lastActiveText.text = $"{dateStr}";
                }

                Debug.Log($"[NeuroRehabLauncher] UpdateUI Refreshed for {profile.patientName} (ID: {profile.userId}) -> Score: {profile.totalXP}, Practiced: {profile.totalCompletedExercises}/16, Accuracy: {profile.averageAccuracy}%");
            }
            finally
            {
                isUpdatingUI = false;
            }
        }

        private void OnDataUpdated(PatientProfile updatedProfile)
        {
            if (!isUpdatingUI)
            {
                UpdateUI();
            }
        }

        public void LaunchSession()
        {
            string uid = !string.IsNullOrEmpty(targetUserId) ? targetUserId : "1001";
            string uname = !string.IsNullOrEmpty(targetUserName) ? targetUserName : "Patient Name";

            PatientProfile profile = null;
            if (PatientDataManager.Instance != null)
            {
                profile = PatientDataManager.Instance.ReloadProfile(uid);
                if (profile == null)
                {
                    profile = PatientDataManager.Instance.GetOrCreateProfile(uid, uname, initialXP);
                }

                PatientDataManager.Instance.SetActiveProfile(profile);

                // Explicitly set language on profile before launching
                if (!string.IsNullOrEmpty(AppLanguage))
                {
                    profile.language = AppLanguage;
                }

                // Automatically save / create JSON on disk at Application.persistentDataPath/PatientData/<userId>.json
                PatientDataManager.Instance.SaveProfile(profile);
            }
            else
            {
                profile = new PatientProfile(uid, uname, initialXP);
                if (!string.IsNullOrEmpty(AppLanguage))
                {
                    profile.language = AppLanguage;
                }
            }

            Debug.Log($"[NeuroRehabLauncher] Launching Session for {profile.patientName} (ID: {profile.userId}, Language: {profile.language})...");

            // Launch Web Portal with User ID, Name, and Language
            if (webViewManager == null)
            {
                webViewManager = FindObjectOfType<NeuroRehabWebViewManager>();
                if (webViewManager == null)
                {
                    GameObject webObj = new GameObject("NeuroRehabWebViewManager");
                    webViewManager = webObj.AddComponent<NeuroRehabWebViewManager>();
                }
            }

            webViewManager.OpenWebView(profile);
        }

        public void SetLanguageAndLaunch(string lang)
        {
            AppLanguage = lang;
            LaunchSession();
        }

        public void SetLanguage(string lang)
        {
            AppLanguage = lang;
            if (PatientDataManager.Instance != null)
            {
                PatientProfile profile = PatientDataManager.Instance.GetActiveProfile();
                if (profile != null)
                {
                    profile.language = lang;
                    PatientDataManager.Instance.SaveProfile(profile);
                }
            }
        }

        private void OnDestroy()
        {
            if (instance == this)
            {
                instance = null;
            }
            if (PatientDataManager.Instance != null)
            {
                PatientDataManager.Instance.OnPatientDataUpdated -= OnDataUpdated;
            }
        }
    }
}
