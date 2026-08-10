using System;
using UnityEngine;

namespace NeuroRehab
{
    public class NeuroRehabWebViewManager : MonoBehaviour
    {
        public static NeuroRehabWebViewManager Instance { get; private set; }

        [Header("WebView Options")]
        public bool useLocalBuild = true;
        public string remoteUrl = "https://example.com";
        public string displayMode = "full"; // "full" or "partial"
        public float[] screenRect = new float[] { 0, 0, 1, 1 };

        private UniWebView webView;

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }


        public void OpenWebView(PatientProfile profile)
        {
            if (profile != null)
            {
                OpenWebView(profile.userId, profile.patientName, profile.totalXP);
            }
            else
            {
                OpenWebView("10114", "Akshay Kadam", 0);
            }
        }

        public void OpenWebView(string patientName = "Akshay Kadam")
        {
            OpenWebView("10114", patientName, 0);
        }

        public void OpenWebView(string userId, string patientName, int initialXp)
        {
            if (string.IsNullOrEmpty(patientName)) patientName = "Akshay Kadam";
            if (string.IsNullOrEmpty(userId)) userId = "10114";

            PatientProfile profile = PatientDataManager.Instance != null 
                ? PatientDataManager.Instance.GetOrCreateProfile(userId, patientName, initialXp)
                : null;

            int xpToPass = profile != null ? profile.totalXP : initialXp;

            string baseUrl;
            if (useLocalBuild)
            {
#if (UNITY_ANDROID || UNITY_IOS) && !UNITY_EDITOR
                baseUrl = UniWebViewHelper.StreamingAssetURLForPath("NewNeuroGame/index.html");
#else
                string localPath = System.IO.Path.Combine(Application.streamingAssetsPath, "NewNeuroGame/index.html");
                baseUrl = "file://" + System.IO.Path.GetFullPath(localPath);
#endif
            }
            else
            {
                baseUrl = remoteUrl;
            }

            string finalUrl = baseUrl;
            if (!finalUrl.Contains("?"))
            {
                finalUrl += "?unity=true";
            }
            else if (!finalUrl.Contains("unity=true"))
            {
                finalUrl += "&unity=true";
            }

            finalUrl += "&patient=" + Uri.EscapeDataString(patientName);
            finalUrl += "&userId=" + Uri.EscapeDataString(userId);
            finalUrl += "&xp=" + xpToPass;

            if (profile != null)
            {
                string hsJson = !string.IsNullOrEmpty(profile.highScoresJson) ? profile.highScoresJson : "{}";
                finalUrl += "&highScores=" + Uri.EscapeDataString(hsJson);

                string progJson = !string.IsNullOrEmpty(profile.progressJson) ? profile.progressJson : "{}";
                finalUrl += "&progressData=" + Uri.EscapeDataString(progJson);

                string haJson = !string.IsNullOrEmpty(profile.highAccuraciesJson) ? profile.highAccuraciesJson : "{}";
                finalUrl += "&highAccuracies=" + Uri.EscapeDataString(haJson);
            }

            Debug.Log($"[NeuroRehab] Launching Session for Patient '{patientName}' (ID: {userId}, XP: {xpToPass}) at URL: {finalUrl}");

#if UNITY_EDITOR
            try
            {
                System.Diagnostics.Process.Start("open", $"-a \"Google Chrome\" \"{finalUrl}\"");
            }
            catch
            {
                try
                {
                    System.Diagnostics.Process.Start("open", $"-a \"Safari\" \"{finalUrl}\"");
                }
                catch
                {
                    System.Diagnostics.Process.Start("open", $"\"{finalUrl}\"");
                }
            }
#else
            if (webView != null)
            {
                Destroy(webView);
            }

            // Native UniWebView 6 execution on Android & iOS device
            webView = gameObject.AddComponent<UniWebView>();

            if (displayMode == "partial")
            {
                int x = (int)(screenRect[0] * Screen.width);
                int y = (int)(screenRect[1] * Screen.height);
                int w = (int)(screenRect[2] * Screen.width);
                int h = (int)(screenRect[3] * Screen.height);
                webView.Frame = new Rect(x, y, w, h);
            }
            else
            {
                webView.Frame = new Rect(0, 0, Screen.width, Screen.height);
            }

            webView.SetAllowFileAccessFromFileURLs(true);
            UniWebView.SetAllowUniversalAccessFromFileURLs(true);
            webView.SetShowSpinnerWhileLoading(true);
            webView.SetBackButtonEnabled(true);

            webView.OnMessageReceived += OnWebMessageReceived;
            webView.OnShouldClose += (view) => {
                CloseWebView();
                return true;
            };

            webView.Load(finalUrl);
            webView.Show();
#endif
        }

        private void OnWebMessageReceived(UniWebView view, UniWebViewMessage message)
        {
            Debug.Log($"[NeuroRehab] Incoming WebMessage -> Scheme: '{message.Scheme}', Path: '{message.Path}', Raw: '{message.RawMessage}'");

            string action = message.Path;
            if (string.IsNullOrEmpty(action) && message.Args != null && message.Args.ContainsKey("action"))
            {
                action = message.Args["action"];
            }

            if (action == "score_sync" || action == "game_complete" || (message.RawMessage != null && (message.RawMessage.Contains("score_sync") || message.RawMessage.Contains("game_complete"))))
            {
                string userId = message.Args.ContainsKey("userId") ? message.Args["userId"] : "10114";
                string patientName = message.Args.ContainsKey("patientName") ? message.Args["patientName"] : (message.Args.ContainsKey("patient") ? message.Args["patient"] : "Akshay Kadam");
                int xp = message.Args.ContainsKey("xp") ? int.Parse(message.Args["xp"]) : 0;
                int completedCount = message.Args.ContainsKey("completedCount") ? int.Parse(message.Args["completedCount"]) : 0;
                int totalSessions = message.Args.ContainsKey("totalSessions") ? int.Parse(message.Args["totalSessions"]) : 0;
                int accuracy = message.Args.ContainsKey("accuracy") ? int.Parse(message.Args["accuracy"]) : 100;
                string highScoresJson = message.Args.ContainsKey("highScores") ? message.Args["highScores"] : null;
                string progressJson = message.Args.ContainsKey("progress") ? message.Args["progress"] : null;
                string highAccuraciesJson = message.Args.ContainsKey("highAccuracies") ? message.Args["highAccuracies"] : null;

                Debug.Log($"[NeuroRehab] Score Sync Received for {patientName} (ID: {userId}) -> XP: {xp}, Accuracy: {accuracy}%, Cleared: {completedCount}");

                if (PatientDataManager.Instance != null)
                {
                    PatientDataManager.Instance.UpdatePatientProgress(userId, xp, completedCount, totalSessions, highScoresJson, progressJson, accuracy, highAccuraciesJson);
                }
            }
            else if (action == "close" || action == "close_webview" || action == "exit" || (message.RawMessage != null && (message.RawMessage.Contains("action=close") || message.RawMessage.Contains("action=exit"))))
            {
                CloseWebView();
            }
        }

        public void CloseWebView()
        {
            if (webView != null)
            {
                webView.Hide();
                Destroy(webView);
                webView = null;
                Debug.Log("[NeuroRehab] UniWebView 6 closed successfully.");
            }

            // Reload fresh JSON profile from disk and notify Unity UI
            if (PatientDataManager.Instance != null)
            {
                PatientProfile activeProfile = PatientDataManager.Instance.GetActiveProfile();
                string targetUserId = activeProfile != null ? activeProfile.userId : "10114";
                PatientProfile freshProfile = PatientDataManager.Instance.GetOrCreateProfile(targetUserId, "Akshay Kadam");
                if (freshProfile != null)
                {
                    PatientDataManager.Instance.SaveProfile(freshProfile);
                }
            }
        }
    }
}
