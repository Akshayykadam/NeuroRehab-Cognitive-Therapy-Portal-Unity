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

#if UNITY_EDITOR
        private System.Net.HttpListener httpListener;
#endif

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
            DontDestroyOnLoad(gameObject);

#if UNITY_EDITOR
            StartEditorHttpBridge();
#endif
        }

#if UNITY_EDITOR
        private void StartEditorHttpBridge()
        {
            try
            {
                httpListener = new System.Net.HttpListener();
                httpListener.Prefixes.Add("http://localhost:8080/");
                httpListener.Start();
                httpListener.BeginGetContext(OnHttpContextReceived, httpListener);
                Debug.Log("[NeuroRehab] Editor HTTP Score Bridge running at http://localhost:8080/");
            }
            catch (Exception ex)
            {
                Debug.LogWarning($"[NeuroRehab] Editor HTTP Bridge notice: {ex.Message}");
            }
        }

        private void OnHttpContextReceived(IAsyncResult result)
        {
            if (httpListener == null || !httpListener.IsListening) return;
            try
            {
                var context = httpListener.EndGetContext(result);
                httpListener.BeginGetContext(OnHttpContextReceived, httpListener);

                var query = context.Request.QueryString;

                if (context.Request.Url != null && context.Request.Url.AbsolutePath.Contains("get_patient_data"))
                {
                    string reqUserId = query["userId"] ?? "10114";
                    string jsonContent = "{}";
                    if (PatientDataManager.Instance != null)
                    {
                        PatientProfile prof = PatientDataManager.Instance.GetOrCreateProfile(reqUserId, "Akshay Kadam");
                        if (prof != null) jsonContent = prof.ToFirebaseJson();
                    }
                    byte[] jsonBuf = System.Text.Encoding.UTF8.GetBytes(jsonContent);
                    context.Response.ContentType = "application/json";
                    context.Response.Headers.Add("Access-Control-Allow-Origin", "*");
                    context.Response.OutputStream.Write(jsonBuf, 0, jsonBuf.Length);
                    context.Response.Close();
                    return;
                }

                string userId = query["userId"] ?? "10114";
                string patientName = query["patientName"] ?? query["patient"] ?? "Akshay Kadam";
                int xp = int.TryParse(query["xp"], out int x) ? x : 0;
                int completedCount = int.TryParse(query["completedCount"], out int c) ? c : 0;
                int totalSessions = int.TryParse(query["totalSessions"], out int s) ? s : 0;
                int accuracy = int.TryParse(query["accuracy"], out int acc) ? acc : 100;
                string highScores = query["highScores"];
                string progress = query["progress"];
                string highAccuracies = query["highAccuracies"];

                if (PatientDataManager.Instance != null)
                {
                    PatientDataManager.Instance.UpdatePatientProgress(userId, xp, completedCount, totalSessions, highScores, progress, accuracy, highAccuracies);
                }

                byte[] buf = System.Text.Encoding.UTF8.GetBytes("{\"status\":\"ok\"}");
                context.Response.ContentType = "application/json";
                context.Response.Headers.Add("Access-Control-Allow-Origin", "*");
                context.Response.OutputStream.Write(buf, 0, buf.Length);
                context.Response.Close();
            }
            catch (Exception ex)
            {
                Debug.LogWarning($"[NeuroRehab] HTTP context handling error: {ex.Message}");
            }
        }

        private void OnDestroy()
        {
            if (httpListener != null)
            {
                try { httpListener.Stop(); httpListener.Close(); } catch {}
                httpListener = null;
            }
        }
#endif

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
                if (!string.IsNullOrEmpty(profile.highScoresJson) && profile.highScoresJson != "{}")
                {
                    finalUrl += "&highScores=" + Uri.EscapeDataString(profile.highScoresJson);
                }
                if (!string.IsNullOrEmpty(profile.progressJson) && profile.progressJson != "{}")
                {
                    finalUrl += "&progressData=" + Uri.EscapeDataString(profile.progressJson);
                }
                if (!string.IsNullOrEmpty(profile.highAccuraciesJson) && profile.highAccuraciesJson != "{}")
                {
                    finalUrl += "&highAccuracies=" + Uri.EscapeDataString(profile.highAccuraciesJson);
                }
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
            Debug.Log($"[NeuroRehab] Incoming WebMessage -> Scheme: {message.Scheme}, Path: {message.Path}, Raw: {message.RawMessage}");

            if (message.Path == "score_sync" || message.Path == "game_complete")
            {
                string userId = message.Args.ContainsKey("userId") ? message.Args["userId"] : "10114";
                string patientName = message.Args.ContainsKey("patient") ? message.Args["patient"] : "Akshay Kadam";
                int xp = message.Args.ContainsKey("xp") ? int.Parse(message.Args["xp"]) : 0;
                int completedCount = message.Args.ContainsKey("completedCount") ? int.Parse(message.Args["completedCount"]) : 0;
                int totalSessions = message.Args.ContainsKey("totalSessions") ? int.Parse(message.Args["totalSessions"]) : 0;
                int accuracy = message.Args.ContainsKey("accuracy") ? int.Parse(message.Args["accuracy"]) : 100;
                string highScoresJson = message.Args.ContainsKey("highScores") ? message.Args["highScores"] : null;
                string progressJson = message.Args.ContainsKey("progress") ? message.Args["progress"] : null;
                string highAccuraciesJson = message.Args.ContainsKey("highAccuracies") ? message.Args["highAccuracies"] : null;

                if (PatientDataManager.Instance != null)
                {
                    PatientDataManager.Instance.UpdatePatientProgress(userId, xp, completedCount, totalSessions, highScoresJson, progressJson, accuracy, highAccuraciesJson);
                }
            }
            else if (message.Path == "close" || message.Path == "close_webview" || message.Path == "exit" || string.IsNullOrEmpty(message.Path) || message.RawMessage.Contains("close") || message.RawMessage.Contains("exit"))
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
