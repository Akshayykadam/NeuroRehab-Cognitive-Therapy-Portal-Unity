using UnityEngine;
using UnityEngine.UI;

namespace NeuroRehab
{
    public class NeuroRehabLauncher : MonoBehaviour
    {
        [Header("Patient Profile Configuration")]
        [Tooltip("Patient's full name")]
        public string targetUserName = "Patient Name";

        [Tooltip("Patient's unique ID")]
        public string targetUserId = "1001";

        // Property backwards-compatibility getters/setters
        public string userName { get => targetUserName; set => targetUserName = value; }
        public string userId { get => targetUserId; set => targetUserId = value; }

        [Tooltip("Initial Score / XP")]
        public int initialXP = 0;

        [Tooltip("Patient's preferred UI Language (e.g., 'Arabic', 'English')")]
        public string targetLanguage = "Arabic";

        [Header("Unity Native UI References (Drag & Drop)")]
        [Tooltip("Drag & drop your Play Button here")]
        public Button playButton;

        [Tooltip("Text component to display Username")]
        public Text usernameText;

        [Tooltip("Text component to display User ID")]
        public Text idText;

        [Tooltip("Text component to display Total Score / XP")]
        public Text scoreText;

        [Tooltip("Text component to display Completed Exercises")]
        public Text completedText;

        [Tooltip("Text component to display Average Accuracy %")]
        public Text accuracyText;

        [Tooltip("Text component to display Progress %")]
        public Text progressText;

        [Tooltip("Text component to display Last Active Date")]
        public Text lastActiveText;

        private NeuroRehabWebViewManager webViewManager;

        private void Start()
        {
            if (string.IsNullOrEmpty(targetUserName)) targetUserName = "Patient Name";
            if (string.IsNullOrEmpty(targetUserId)) targetUserId = "1001";

            // 1. Ensure Managers exist
            if (PatientDataManager.Instance == null)
            {
                GameObject dataObj = new GameObject("PatientDataManager");
                dataObj.AddComponent<PatientDataManager>();
            }

            webViewManager = FindObjectOfType<NeuroRehabWebViewManager>();
            if (webViewManager == null)
            {
                GameObject webObj = new GameObject("NeuroRehabWebViewManager");
                webViewManager = webObj.AddComponent<NeuroRehabWebViewManager>();
            }

            // Listen for data updates from web sessions to refresh Unity UI live
            if (PatientDataManager.Instance != null)
            {
                PatientDataManager.Instance.OnPatientDataUpdated += OnDataUpdated;
            }

            // 2. Refresh Native Unity UI
            UpdateUI();

            // 3. Connect Play Button Listener
            if (playButton != null)
            {
                playButton.onClick.RemoveAllListeners();
                playButton.onClick.AddListener(LaunchSession);
            }
        }

        public void UpdateUI()
        {
            if (string.IsNullOrEmpty(targetUserName)) targetUserName = "Patient Name";
            if (string.IsNullOrEmpty(targetUserId)) targetUserId = "1001";

            // Load active profile set by previous scene/login, or fallback to Inspector settings
            PatientProfile profile = null;
            if (PatientDataManager.Instance != null)
            {
                profile = PatientDataManager.Instance.GetActiveProfile();
                if (profile == null)
                {
                    profile = PatientDataManager.Instance.GetOrCreateProfile(targetUserId, targetUserName, initialXP);
                }
            }
            else
            {
                profile = new PatientProfile(targetUserId, targetUserName, initialXP);
            }

            // Auto-find Text components by name if not linked in Inspector
            if (usernameText == null) { GameObject obj = GameObject.Find("UserName"); if (obj != null) usernameText = obj.GetComponent<Text>(); }
            if (idText == null) { GameObject obj = GameObject.Find("UserID"); if (obj != null) idText = obj.GetComponent<Text>(); }
            if (scoreText == null) { GameObject obj = GameObject.Find("Score"); if (obj != null) scoreText = obj.GetComponent<Text>(); }
            if (completedText == null) { GameObject obj = GameObject.Find("Completed"); if (obj != null) completedText = obj.GetComponent<Text>(); }
            if (accuracyText == null) { GameObject obj = GameObject.Find("Accuracy"); if (obj != null) accuracyText = obj.GetComponent<Text>(); }
            if (progressText == null) { GameObject obj = GameObject.Find("Progress"); if (obj != null) progressText = obj.GetComponent<Text>(); }
            if (lastActiveText == null) { GameObject obj = GameObject.Find("Last Active"); if (obj != null) lastActiveText = obj.GetComponent<Text>(); }

            if (usernameText != null) usernameText.text = profile.patientName;
            if (idText != null) idText.text = $"ID: {profile.userId}";
            if (scoreText != null) scoreText.text = $"⭐ {profile.totalXP} Score";
            if (completedText != null) completedText.text = $"✅ {profile.totalCompletedExercises} / 16 Practiced";
            if (accuracyText != null) accuracyText.text = $"🎯 {profile.averageAccuracy}% Accuracy";

            if (progressText != null)
            {
                int progressPercent = profile.GetOverallProgressPercentage();
                progressText.text = $"📊 {progressPercent}% Progress";
            }

            if (lastActiveText != null)
            {
                string dateStr = !string.IsNullOrEmpty(profile.lastActiveDate) ? profile.lastActiveDate : System.DateTime.Now.ToString("yyyy-MM-dd");
                lastActiveText.text = $"📅 {dateStr}";
            }
        }

        private void OnDataUpdated(PatientProfile updatedProfile)
        {
            PatientProfile activeProfile = PatientDataManager.Instance != null ? PatientDataManager.Instance.GetActiveProfile() : null;
            string currentId = activeProfile != null ? activeProfile.userId : targetUserId;
            if (updatedProfile != null && updatedProfile.userId == currentId)
            {
                UpdateUI();
            }
        }

        public void LaunchSession()
        {
            if (string.IsNullOrEmpty(targetUserName)) targetUserName = "Patient Name";
            if (string.IsNullOrEmpty(targetUserId)) targetUserId = "1001";
            if (string.IsNullOrEmpty(targetLanguage)) targetLanguage = "Arabic";

            PatientProfile profile = null;
            if (PatientDataManager.Instance != null)
            {
                profile = PatientDataManager.Instance.GetActiveProfile();
                if (profile == null)
                {
                    profile = PatientDataManager.Instance.GetOrCreateProfile(targetUserId, targetUserName, initialXP);
                    PatientDataManager.Instance.SetActiveProfile(profile);
                }

                // Explicitly set language on profile before launching
                profile.language = targetLanguage;

                // Automatically save / create JSON on disk at Application.persistentDataPath/PatientData/<userId>.json
                PatientDataManager.Instance.SaveProfile(profile);
            }
            else
            {
                profile = new PatientProfile(targetUserId, targetUserName, initialXP);
                profile.language = targetLanguage;
            }

            Debug.Log($"[NeuroRehabLauncher] Launching Session for {profile.patientName} (ID: {profile.userId}, Language: {profile.language})...");

            // Launch Web Portal with User ID, Name, and Language
            if (webViewManager != null)
            {
                webViewManager.OpenWebView(profile);
            }
            else
            {
                var mgr = FindObjectOfType<NeuroRehabWebViewManager>();
                if (mgr != null)
                {
                    mgr.OpenWebView(profile);
                }
            }
        }

        /// <summary>
        /// Call this directly from Unity UI button OnClick event to set language and launch immediately.
        /// E.g. Arabic button -> SetLanguageAndLaunch("Arabic")
        /// </summary>
        public void SetLanguageAndLaunch(string lang)
        {
            targetLanguage = lang;
            LaunchSession();
        }

        /// <summary>
        /// Change the target language dynamically from Unity UI dropdown or buttons.
        /// </summary>
        public void SetLanguage(string lang)
        {
            targetLanguage = lang;
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
            if (PatientDataManager.Instance != null)
            {
                PatientDataManager.Instance.OnPatientDataUpdated -= OnDataUpdated;
            }
        }
    }
}
