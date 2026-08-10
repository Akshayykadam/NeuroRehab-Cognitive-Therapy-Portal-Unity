using UnityEngine;
using UnityEngine.UI;

namespace NeuroRehab
{
    public class NeuroRehabLauncher : MonoBehaviour
    {
        [Header("Patient Profile Configuration (Replace in real project)")]
        [Tooltip("Patient's full name")]
        public string userName = "Akshay Kadam";

        [Tooltip("Patient's unique ID")]
        public string userId = "10114";

        [Tooltip("Initial Score / XP")]
        public int initialXP = 0;

        [Header("Unity Native UI References (Drag & Drop)")]
        [Tooltip("Drag & drop your Play Button here")]
        public Button playButton;

        [Tooltip("Text component to display Username (e.g. 'Akshay Kadam')")]
        public Text usernameText;

        [Tooltip("Text component to display User ID (e.g. 'ID: 10114')")]
        public Text idText;

        [Tooltip("Text component to display Total Score / XP (e.g. '⭐ 450 Score')")]
        public Text scoreText;

        [Tooltip("Text component to display Completed Exercises (e.g. '✅ 3 / 16 Completed')")]
        public Text completedText;

        [Tooltip("Text component to display Average Accuracy % (e.g. '🎯 88% Accuracy')")]
        public Text accuracyText;

        [Tooltip("Text component to display Progress % (e.g. '📊 19% Progress')")]
        public Text progressText;

        [Tooltip("Text component to display Last Active Date (e.g. '📅 2026-08-07')")]
        public Text lastActiveText;

        private NeuroRehabWebViewManager webViewManager;

        private void Start()
        {
            if (userName == "Akshay" || string.IsNullOrEmpty(userName)) userName = "Akshay Kadam";

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
            if (userName == "Akshay" || string.IsNullOrEmpty(userName)) userName = "Akshay Kadam";

            // Load saved profile directly from disk / memory
            PatientProfile profile = PatientDataManager.Instance != null 
                ? PatientDataManager.Instance.GetOrCreateProfile(userId, userName, initialXP)
                : new PatientProfile(userId, userName, initialXP);

            // Auto-find UserName Text component if not linked in Inspector
            if (usernameText == null)
            {
                GameObject userObj = GameObject.Find("UserName");
                if (userObj != null) usernameText = userObj.GetComponent<Text>();
            }

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
            if (updatedProfile != null && updatedProfile.userId == userId)
            {
                UpdateUI();
            }
        }

        public void LaunchSession()
        {
            if (userName == "Akshay" || string.IsNullOrEmpty(userName)) userName = "Akshay Kadam";

            Debug.Log($"[NeuroRehabLauncher] Launching Session for {userName} (ID: {userId})...");

            PatientProfile profile = null;
            if (PatientDataManager.Instance != null)
            {
                profile = PatientDataManager.Instance.GetOrCreateProfile(userId, userName, initialXP);
                if (profile != null) profile.patientName = "Akshay Kadam";
                PatientDataManager.Instance.SetActiveProfile(profile);

                // Automatically save / create JSON on disk at Application.persistentDataPath/PatientData/<userId>.json
                PatientDataManager.Instance.SaveProfile(profile);
            }
            else
            {
                profile = new PatientProfile(userId, userName, initialXP);
            }

            // Launch Web Portal with User ID and Name
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

        private void OnDestroy()
        {
            if (PatientDataManager.Instance != null)
            {
                PatientDataManager.Instance.OnPatientDataUpdated -= OnDataUpdated;
            }
        }
    }
}
