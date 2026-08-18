using System;
using System.Collections;
using UnityEngine;
using UnityEngine.Networking;

namespace NeuroRehab
{
    public class NeuroRehabWebViewManager : MonoBehaviour
    {
        private static NeuroRehabWebViewManager instance;
        public static NeuroRehabWebViewManager Instance
        {
            get
            {
                if (instance == null)
                {
                    instance = FindObjectOfType<NeuroRehabWebViewManager>();
                    if (instance == null)
                    {
                        GameObject webObj = new GameObject("NeuroRehabWebViewManager");
                        instance = webObj.AddComponent<NeuroRehabWebViewManager>();
                    }
                }
                return instance;
            }
        }

        [Header("WebView Options")]
        public bool useLocalBuild = true;
        public string remoteUrl = "https://example.com";
        public string displayMode = "full"; // "full" or "partial"
        public float[] screenRect = new float[] { 0, 0, 1, 1 };

        [Header("Localisation")]
        /// <summary>
        /// Optional override language name matching a column header in the localization CSV.
        /// If left empty, uses NeuroRehabLauncher.AppLanguage automatically.
        /// </summary>
        public string language = "";

        /// <summary>
        /// Optional: absolute path to a CSV file downloaded from Google Sheets into persistent storage.
        /// If non-empty the WebView will load this CSV at startup instead of the bundled one.
        /// Set via Unity UI Inspector or by PatientDataManager after download.
        /// </summary>
        public string persistentCsvPath = "";

        private UniWebView webView;

        private void Awake()
        {
            if (instance != null && instance != this)
            {
                Destroy(gameObject);
                return;
            }
            instance = this;
            DontDestroyOnLoad(gameObject);
        }


        public void OpenWebView(PatientProfile profile)
        {
            if (profile != null)
            {
                // Pass the patient's stored language preference directly
                string profileLang = !string.IsNullOrEmpty(profile.language) ? profile.language : language;
                OpenWebView(profile.userId, profile.patientName, profile.totalXP, profileLang);
            }
            else
            {
                PatientProfile active = PatientDataManager.Instance != null ? PatientDataManager.Instance.GetActiveProfile() : null;
                string uid = active != null ? active.userId : "";
                string name = active != null ? active.patientName : "";
                int xp = active != null ? active.totalXP : 0;
                string lang = active != null && !string.IsNullOrEmpty(active.language) ? active.language : language;
                OpenWebView(uid, name, xp, lang);
            }
        }

        public void OpenWebView()
        {
            PatientProfile active = PatientDataManager.Instance != null ? PatientDataManager.Instance.GetActiveProfile() : null;
            string uid = active != null ? active.userId : "";
            string name = active != null ? active.patientName : "";
            int xp = active != null ? active.totalXP : 0;
            string lang = active != null && !string.IsNullOrEmpty(active.language) ? active.language : language;
            OpenWebView(uid, name, xp, lang);
        }

        public void OpenWebView(string userId, string patientName, int initialXp, string userLanguage = null)
        {
            PatientProfile profile = PatientDataManager.Instance != null 
                ? PatientDataManager.Instance.GetOrCreateProfile(userId, patientName, initialXp)
                : null;

            int xpToPass = profile != null ? profile.totalXP : initialXp;

            string defaultLang = NeuroRehabLauncher.instance != null ? NeuroRehabLauncher.instance.AppLanguage : "";

            // Priority: explicitly passed userLanguage > profile field > inspector field > NeuroRehabLauncher.instance.AppLanguage
            string resolvedLanguage = !string.IsNullOrEmpty(userLanguage) 
                ? userLanguage 
                : (profile != null && !string.IsNullOrEmpty(profile.language) 
                    ? profile.language 
                    : (!string.IsNullOrEmpty(language) ? language : defaultLang));

            if (string.IsNullOrEmpty(resolvedLanguage))
            {
                resolvedLanguage = defaultLang;
            }

            // Sync the inspector field so it stays consistent
            language = resolvedLanguage;

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

            // Language query parameter — i18n.js reads this on DOMContentLoaded
            if (!string.IsNullOrEmpty(resolvedLanguage))
            {
                finalUrl += "&lang=" + Uri.EscapeDataString(resolvedLanguage);
            }

            // Optional: pass CSV content from persistent storage
            if (!string.IsNullOrEmpty(persistentCsvPath) && System.IO.File.Exists(persistentCsvPath))
            {
                // CSV path is too large for a URL param; we pass a flag so JS knows to request it
                finalUrl += "&csvReady=1";
                Debug.Log($"[NeuroRehab] Persistent CSV found at: {persistentCsvPath}");
            }

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
                Application.OpenURL(finalUrl);
            }
            catch (Exception ex)
            {
                Debug.LogWarning($"[NeuroRehabWebViewManager] Failed to open URL in browser: {ex.Message}");
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

            // If payload contains score/progress data, sync it immediately
            bool hasScoreData = message.Args != null && (message.Args.ContainsKey("xp") || message.Args.ContainsKey("completedCount") || message.Args.ContainsKey("highScores") || message.Args.ContainsKey("progress"));

            if (hasScoreData || action == "score_sync" || action == "game_complete" || action == "exercise_completed" || (message.RawMessage != null && (message.RawMessage.Contains("score_sync") || message.RawMessage.Contains("game_complete") || message.RawMessage.Contains("exercise_completed"))))
            {
                string userId = message.Args != null && message.Args.ContainsKey("userId") ? message.Args["userId"] : "1001";
                string patientName = message.Args != null && message.Args.ContainsKey("patientName") ? message.Args["patientName"] : (message.Args != null && message.Args.ContainsKey("patient") ? message.Args["patient"] : "Patient Name");
                int xp = (message.Args != null && message.Args.ContainsKey("xp") && int.TryParse(message.Args["xp"], out int pXp)) ? pXp : 0;
                int completedCount = (message.Args != null && message.Args.ContainsKey("completedCount") && int.TryParse(message.Args["completedCount"], out int pCount)) ? pCount : 0;
                int totalSessions = (message.Args != null && message.Args.ContainsKey("totalSessions") && int.TryParse(message.Args["totalSessions"], out int pSess)) ? pSess : 0;
                int accuracy = (message.Args != null && message.Args.ContainsKey("accuracy") && int.TryParse(message.Args["accuracy"], out int pAcc)) ? pAcc : 100;
                string highScoresJson = message.Args != null && message.Args.ContainsKey("highScores") ? message.Args["highScores"] : null;
                string progressJson = message.Args != null && message.Args.ContainsKey("progress") ? message.Args["progress"] : null;
                string highAccuraciesJson = message.Args != null && message.Args.ContainsKey("highAccuracies") ? message.Args["highAccuracies"] : null;

                Debug.Log($"[NeuroRehab] Score Sync Received for {patientName} (ID: {userId}) -> XP: {xp}, Accuracy: {accuracy}%, Cleared: {completedCount}");

                if (PatientDataManager.Instance != null)
                {
                    PatientDataManager.Instance.UpdatePatientProgress(userId, xp, completedCount, totalSessions, highScoresJson, progressJson, accuracy, highAccuraciesJson);
                }
            }

            if (action == "close" || action == "close_webview" || action == "exit" || (message.RawMessage != null && (message.RawMessage.Contains("action=close") || message.RawMessage.Contains("action=exit"))))
            {
                CloseWebView();
            }
        }

        // ── Runtime Language Bridge ────────────────────────────────────────────────

        /// <summary>
        /// Call this to push a language change into the currently visible WebView at runtime.
        /// Equivalent to the user/clinician selecting a new language from the Unity UI.
        /// </summary>
        public void SendLanguage(string langName)
        {
            language = langName;
#if !UNITY_EDITOR
            if (webView != null)
            {
                string js = $"window.UnityBridge && window.UnityBridge.dispatchEvent('set_language', {{ lang: '{langName}' }});";
                webView.EvaluateJavaScript(js, (result) => {
                    Debug.Log($"[NeuroRehab] SendLanguage '{langName}' result: {result.data}");
                });
            }
#endif
        }

        /// <summary>
        /// Tries to load the best available CSV in this priority order:
        ///   1. Persistent data path (downloaded from Google Sheets)
        ///   2. Bundled CSV inside StreamingAssets / NewNeuroGame (always available offline)
        /// Call this right after OpenWebView() or from a download callback.
        /// </summary>
        public void TryLoadBestCSV()
        {
            string persistentPath = System.IO.Path.Combine(Application.persistentDataPath, "Cognitive games localization CSV.csv");

            if (System.IO.File.Exists(persistentPath))
            {
                Debug.Log($"[NeuroRehab] Using persistent CSV: {persistentPath}");
                LoadPersistentCSV(persistentPath);
            }
            else
            {
                Debug.Log("[NeuroRehab] Persistent CSV not found — loading bundled StreamingAssets CSV.");
                StartCoroutine(LoadBundledCSVCoroutine());
            }
        }

        /// <summary>
        /// Loads the bundled "Cognitive games localization CSV.csv" from StreamingAssets using UnityWebRequest
        /// (required on Android where StreamingAssets is inside the APK).
        /// </summary>
        private IEnumerator LoadBundledCSVCoroutine()
        {
            // On Android: Application.streamingAssetsPath is a jar:// URL — must use UnityWebRequest
            // On iOS/Editor: it's a plain file path
            string bundledPath;
#if UNITY_ANDROID && !UNITY_EDITOR
            bundledPath = System.IO.Path.Combine(Application.streamingAssetsPath, "NewNeuroGame/Cognitive games localization CSV.csv");
#else
            bundledPath = "file://" + System.IO.Path.Combine(Application.streamingAssetsPath, "NewNeuroGame/Cognitive games localization CSV.csv");
#endif

            using (UnityWebRequest req = UnityWebRequest.Get(bundledPath))
            {
                yield return req.SendWebRequest();

                if (req.result == UnityWebRequest.Result.Success)
                {
                    string csvContent = req.downloadHandler.text;
                    string escaped = csvContent.Replace("\\", "\\\\").Replace("`", "\\`");

#if !UNITY_EDITOR
                    if (webView != null)
                    {
                        string js = $"window.UnityBridge && window.UnityBridge.dispatchEvent('load_csv', {{ csv: `{escaped}`, lang: '{language}' }});";
                        webView.EvaluateJavaScript(js, (result) =>
                        {
                            Debug.Log($"[NeuroRehab] Bundled CSV loaded, result: {result.data}");
                        });
                    }
#else
                    Debug.Log("[NeuroRehab] (Editor) Bundled CSV loaded — WebView not active in Editor.");
#endif
                }
                else
                {
                    Debug.LogWarning($"[NeuroRehab] Could not load bundled CSV from: {bundledPath} — Error: {req.error}");
                    // The JS in the WebView already auto-fetches "Cognitive games localization CSV.csv" on startup,
                    // so the bundled translations still apply even without this Unity push.
                }
            }
        }

        /// <summary>
        /// Loads a translation CSV from a specific file path and sends it to the WebView.
        /// If the file is missing, automatically falls back to the bundled StreamingAssets CSV.
        /// </summary>
        public void LoadPersistentCSV(string csvFilePath)
        {
            persistentCsvPath = csvFilePath;

            if (!System.IO.File.Exists(csvFilePath))
            {
                Debug.LogWarning($"[NeuroRehab] CSV not found at '{csvFilePath}' — falling back to bundled StreamingAssets CSV.");
                StartCoroutine(LoadBundledCSVCoroutine());
                return;
            }

            string csvContent = System.IO.File.ReadAllText(csvFilePath, System.Text.Encoding.UTF8);
            // Escape backticks and backslashes for JS template literal injection
            string escaped = csvContent.Replace("\\", "\\\\").Replace("`", "\\`");

#if !UNITY_EDITOR
            if (webView != null)
            {
                string js = $"window.UnityBridge && window.UnityBridge.dispatchEvent('load_csv', {{ csv: `{escaped}`, lang: '{language}' }});";
                webView.EvaluateJavaScript(js, (result) =>
                {
                    Debug.Log($"[NeuroRehab] Persistent CSV pushed to WebView: {result.data}");
                });
            }
#endif
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
                PatientProfile active = PatientDataManager.Instance.GetActiveProfile();
                string uid = active != null && !string.IsNullOrEmpty(active.userId) ? active.userId : (NeuroRehabLauncher.Instance != null ? NeuroRehabLauncher.Instance.targetUserId : "1001");
                string uname = active != null && !string.IsNullOrEmpty(active.patientName) ? active.patientName : (NeuroRehabLauncher.Instance != null ? NeuroRehabLauncher.Instance.targetUserName : "Patient");

                PatientProfile freshProfile = PatientDataManager.Instance.ReloadProfile(uid);
                if (freshProfile == null)
                {
                    freshProfile = PatientDataManager.Instance.GetOrCreateProfile(uid, uname);
                }

                if (freshProfile != null)
                {
                    PatientDataManager.Instance.SetActiveProfile(freshProfile);
                    PatientDataManager.Instance.SaveProfile(freshProfile);
                }
            }

            // Explicitly force Native Unity Launcher UI refresh immediately
            if (NeuroRehabLauncher.Instance != null)
            {
                NeuroRehabLauncher.Instance.UpdateUI();
            }
        }
    }
}
