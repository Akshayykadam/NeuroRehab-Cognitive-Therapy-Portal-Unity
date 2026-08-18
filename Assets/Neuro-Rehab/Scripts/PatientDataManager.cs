using System;
using System.Collections.Generic;
using System.IO;
using UnityEngine;

namespace NeuroRehab
{
    public class PatientDataManager : MonoBehaviour
    {
        private static PatientDataManager instance;
        public static PatientDataManager Instance
        {
            get
            {
                if (instance == null)
                {
                    instance = FindObjectOfType<PatientDataManager>();
                    if (instance == null)
                    {
                        GameObject dataObj = new GameObject("PatientDataManager");
                        instance = dataObj.AddComponent<PatientDataManager>();
                    }
                }
                return instance;
            }
        }

        public event Action<PatientProfile> OnPatientDataUpdated;

        private List<PatientProfile> patientProfiles = new List<PatientProfile>();
        private PatientProfile activeProfile;

        private string storageFolderPath;

        private readonly List<Action> mainThreadActions = new List<Action>();
        private readonly object actionLock = new object();

        private void Awake()
        {
            if (instance != null && instance != this)
            {
                Destroy(this);
                return;
            }
            instance = this;

            // Only persist if not attached to a scene GameObject with UI scripts
            if (GetComponent<NeuroRehabLauncher>() == null)
            {
                transform.SetParent(null);
                DontDestroyOnLoad(gameObject);
            }

            // Establish dedicated JSON storage directory for Firebase pushing
            storageFolderPath = Path.Combine(Application.persistentDataPath, "PatientData");
            if (!Directory.Exists(storageFolderPath))
            {
                Directory.CreateDirectory(storageFolderPath);
            }

            Debug.Log($"[PatientDataManager] Firebase JSON Storage Directory: {storageFolderPath}");

#if UNITY_EDITOR || UNITY_STANDALONE
            StartLocalHttpServer();
#endif
        }

        private void Update()
        {
            if (mainThreadActions.Count > 0)
            {
                Action[] actionsToRun;
                lock (actionLock)
                {
                    actionsToRun = mainThreadActions.ToArray();
                    mainThreadActions.Clear();
                }

                for (int i = 0; i < actionsToRun.Length; i++)
                {
                    try
                    {
                        actionsToRun[i]?.Invoke();
                    }
                    catch (Exception ex)
                    {
                        Debug.LogError($"[PatientDataManager] MainThreadAction Error: {ex.Message}");
                    }
                }
            }
        }

        public void EnqueueMainThread(Action action)
        {
            if (action == null) return;
            lock (actionLock)
            {
                mainThreadActions.Add(action);
            }
        }

#if UNITY_EDITOR || UNITY_STANDALONE
        private System.Net.HttpListener httpListener;
        private System.Threading.Thread httpThread;
        private bool isHttpRunning = false;

        private void StartLocalHttpServer()
        {
            if (isHttpRunning) return;
            try
            {
                httpListener = new System.Net.HttpListener();
                httpListener.Prefixes.Add("http://localhost:8080/");
                httpListener.Prefixes.Add("http://127.0.0.1:8080/");
                httpListener.Start();
                isHttpRunning = true;
                httpThread = new System.Threading.Thread(HttpServerLoop)
                {
                    IsBackground = true
                };
                httpThread.Start();
                Debug.Log("[PatientDataManager] Local Editor HTTP Server running on http://localhost:8080/");
            }
            catch (Exception ex)
            {
                Debug.LogWarning($"[PatientDataManager] Local HTTP Server not started: {ex.Message}");
            }
        }

        private void HttpServerLoop()
        {
            while (isHttpRunning && httpListener != null && httpListener.IsListening)
            {
                try
                {
                    var context = httpListener.GetContext();
                    ProcessHttpRequest(context);
                }
                catch
                {
                    // Listener closed or aborted
                }
            }
        }

        private void ProcessHttpRequest(System.Net.HttpListenerContext context)
        {
            try
            {
                var req = context.Request;
                var res = context.Response;

                // CORS headers
                res.AddHeader("Access-Control-Allow-Origin", "*");
                res.AddHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
                res.AddHeader("Access-Control-Allow-Headers", "Content-Type");

                if (req.HttpMethod == "OPTIONS")
                {
                    res.StatusCode = 200;
                    res.Close();
                    return;
                }

                string rawUrl = req.RawUrl ?? "";
                string path = req.Url.AbsolutePath;

                if (path == "/score_sync" || rawUrl.Contains("score_sync"))
                {
                    var query = System.Web.HttpUtility.ParseQueryString(req.Url.Query);
                    string userId = query["userId"] ?? "1001";
                    int xp = int.TryParse(query["xp"], out int pXp) ? pXp : 0;
                    int completedCount = int.TryParse(query["completedCount"], out int pCount) ? pCount : 0;
                    int totalSessions = int.TryParse(query["totalSessions"], out int pSess) ? pSess : 0;
                    int accuracy = int.TryParse(query["accuracy"], out int pAcc) ? pAcc : 100;
                    string highScores = query["highScores"];
                    string progress = query["progress"];
                    string highAccuracies = query["highAccuracies"];

                    EnqueueMainThread(() =>
                    {
                        UpdatePatientProgress(userId, xp, completedCount, totalSessions, highScores, progress, accuracy, highAccuracies);
                        if (NeuroRehabLauncher.Instance != null)
                        {
                            NeuroRehabLauncher.Instance.UpdateUI();
                        }
                    });

                    byte[] buffer = System.Text.Encoding.UTF8.GetBytes("{\"status\":\"ok\"}");
                    res.ContentType = "application/json";
                    res.ContentLength64 = buffer.Length;
                    res.OutputStream.Write(buffer, 0, buffer.Length);
                    res.Close();
                    return;
                }
                else if (path == "/get_patient_data" || rawUrl.Contains("get_patient_data"))
                {
                    var query = System.Web.HttpUtility.ParseQueryString(req.Url.Query);
                    string userId = query["userId"] ?? "1001";
                    string filePath = GetPatientJsonPath(userId);
                    string json = "{}";
                    if (File.Exists(filePath))
                    {
                        json = File.ReadAllText(filePath);
                    }

                    byte[] buffer = System.Text.Encoding.UTF8.GetBytes(json);
                    res.ContentType = "application/json";
                    res.ContentLength64 = buffer.Length;
                    res.OutputStream.Write(buffer, 0, buffer.Length);
                    res.Close();
                    return;
                }

                res.StatusCode = 404;
                res.Close();
            }
            catch (Exception ex)
            {
                Debug.LogWarning($"[PatientDataManager] HTTP Request handling error: {ex.Message}");
            }
        }

        private void StopLocalHttpServer()
        {
            isHttpRunning = false;
            if (httpListener != null)
            {
                try { httpListener.Stop(); httpListener.Close(); } catch { }
                httpListener = null;
            }
            if (httpThread != null)
            {
                try { httpThread.Abort(); } catch { }
                httpThread = null;
            }
        }

        private void OnDestroy()
        {
            StopLocalHttpServer();
        }

        private void OnApplicationQuit()
        {
            StopLocalHttpServer();
        }
#endif

        private static readonly object fileLock = new object();

        public PatientProfile GetOrCreateProfile(string userId, string userName, int defaultXp = 0)
        {
            string filePath = GetPatientJsonPath(userId);
            PatientProfile profile = patientProfiles.Find(p => p.userId == userId);

            lock (fileLock)
            {
                // 1. If JSON file already exists on disk, read latest data from disk safely
                if (File.Exists(filePath))
                {
                    try
                    {
                        string json = "";
                        using (FileStream fs = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
                        using (StreamReader reader = new StreamReader(fs))
                        {
                            json = reader.ReadToEnd();
                        }

                        PatientProfile loadedDisk = JsonUtility.FromJson<PatientProfile>(json);
                        if (loadedDisk != null && !string.IsNullOrEmpty(loadedDisk.userId))
                        {
                            if (string.IsNullOrEmpty(loadedDisk.patientName))
                            {
                                loadedDisk.patientName = userName;
                            }

                            if (profile != null)
                            {
                                profile.patientName = loadedDisk.patientName;
                                profile.totalXP = loadedDisk.totalXP;
                                profile.totalCompletedExercises = loadedDisk.totalCompletedExercises;
                                profile.averageAccuracy = loadedDisk.averageAccuracy;
                                profile.totalSessions = loadedDisk.totalSessions;
                                profile.highScoresJson = loadedDisk.highScoresJson;
                                profile.progressJson = loadedDisk.progressJson;
                                profile.highAccuraciesJson = loadedDisk.highAccuraciesJson;
                                string defaultLang = NeuroRehabLauncher.instance != null ? NeuroRehabLauncher.instance.AppLanguage : "";
                                profile.language = !string.IsNullOrEmpty(loadedDisk.language) ? loadedDisk.language : defaultLang;
                            }
                            else
                            {
                                profile = loadedDisk;
                                if (string.IsNullOrEmpty(profile.language))
                                {
                                    profile.language = NeuroRehabLauncher.instance != null ? NeuroRehabLauncher.instance.AppLanguage : "";
                                }
                                patientProfiles.Add(profile);
                            }

                            Debug.Log($"[PatientDataManager] Reloaded fresh JSON from disk for {profile.patientName} (ID: {profile.userId}) -> XP: {profile.totalXP}, Accuracy: {profile.averageAccuracy}%, Cleared: {profile.totalCompletedExercises}");
                            return profile;
                        }
                    }
                    catch (Exception ex)
                    {
                        Debug.LogWarning($"[PatientDataManager] Failed to parse JSON file for {userId}: {ex.Message}");
                    }
                }
            }

            // 2. Try loading from Resources template folder as fallback (Assets/Resources/PatientData/userId.json)
            TextAsset resourceJson = Resources.Load<TextAsset>($"PatientData/{userId}");
            if (resourceJson != null && !string.IsNullOrEmpty(resourceJson.text))
            {
                try
                {
                    PatientProfile resProfile = JsonUtility.FromJson<PatientProfile>(resourceJson.text);
                    if (resProfile != null && !string.IsNullOrEmpty(resProfile.userId))
                    {
                        if (string.IsNullOrEmpty(resProfile.patientName))
                        {
                            resProfile.patientName = userName;
                        }
                        if (profile != null)
                        {
                            profile.patientName = resProfile.patientName;
                            profile.totalXP = resProfile.totalXP;
                            profile.totalCompletedExercises = resProfile.totalCompletedExercises;
                            profile.averageAccuracy = resProfile.averageAccuracy;
                            profile.totalSessions = resProfile.totalSessions;
                            profile.highScoresJson = resProfile.highScoresJson;
                            profile.progressJson = resProfile.progressJson;
                            profile.highAccuraciesJson = resProfile.highAccuraciesJson;
                        }
                        else
                        {
                            profile = resProfile;
                            patientProfiles.Add(profile);
                        }
                        SaveProfile(profile);
                        Debug.Log($"[PatientDataManager] Loaded profile template from Resources/PatientData/{userId}");
                        return profile;
                    }
                }
                catch (Exception ex)
                {
                    Debug.LogWarning($"[PatientDataManager] Failed to parse Resources JSON for {userId}: {ex.Message}");
                }
            }

            // 3. Otherwise return existing memory profile or create new default profile
            if (profile != null)
            {
                if (activeProfile == null || activeProfile.userId == userId)
                {
                    activeProfile = profile;
                }
                return profile;
            }

            PatientProfile newProfile = new PatientProfile(userId, userName, defaultXp);
            patientProfiles.Add(newProfile);
            if (activeProfile == null || activeProfile.userId == userId)
            {
                activeProfile = newProfile;
            }
            SaveProfile(newProfile);

            return newProfile;
        }

        /// <summary>
        /// Explicitly reloads the latest profile data from disk into memory,
        /// updating the cached patient profile and active profile.
        /// </summary>
        public PatientProfile ReloadProfile(string userId)
        {
            if (string.IsNullOrEmpty(userId))
            {
                userId = activeProfile != null ? activeProfile.userId : "1001";
            }

            string filePath = GetPatientJsonPath(userId);
            PatientProfile profile = patientProfiles.Find(p => p.userId == userId);

            lock (fileLock)
            {
                if (File.Exists(filePath))
                {
                    try
                    {
                        string json = "";
                        using (FileStream fs = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
                        using (StreamReader reader = new StreamReader(fs))
                        {
                            json = reader.ReadToEnd();
                        }

                        PatientProfile loadedDisk = JsonUtility.FromJson<PatientProfile>(json);
                        if (loadedDisk != null && !string.IsNullOrEmpty(loadedDisk.userId))
                        {
                            if (profile != null)
                            {
                                profile.patientName = loadedDisk.patientName;
                                profile.totalXP = loadedDisk.totalXP;
                                profile.totalCompletedExercises = loadedDisk.totalCompletedExercises;
                                profile.averageAccuracy = loadedDisk.averageAccuracy;
                                profile.totalSessions = loadedDisk.totalSessions;
                                profile.highScoresJson = loadedDisk.highScoresJson;
                                profile.progressJson = loadedDisk.progressJson;
                                profile.highAccuraciesJson = loadedDisk.highAccuraciesJson;
                                if (!string.IsNullOrEmpty(loadedDisk.lastActiveDate)) profile.lastActiveDate = loadedDisk.lastActiveDate;
                                if (!string.IsNullOrEmpty(loadedDisk.updatedAtIso)) profile.updatedAtIso = loadedDisk.updatedAtIso;
                                string defaultLang = NeuroRehabLauncher.instance != null ? NeuroRehabLauncher.instance.AppLanguage : "";
                                profile.language = !string.IsNullOrEmpty(loadedDisk.language) ? loadedDisk.language : defaultLang;
                            }
                            else
                            {
                                profile = loadedDisk;
                                string defaultLang = NeuroRehabLauncher.instance != null ? NeuroRehabLauncher.instance.AppLanguage : "";
                                if (string.IsNullOrEmpty(profile.language)) profile.language = defaultLang;
                                patientProfiles.Add(profile);
                            }

                            if (activeProfile == null || activeProfile.userId == userId)
                            {
                                activeProfile = profile;
                            }

                            Debug.Log($"[PatientDataManager] ReloadProfile SUCCESS for {profile.patientName} (ID: {profile.userId}) -> XP: {profile.totalXP}, Accuracy: {profile.averageAccuracy}%, Cleared: {profile.totalCompletedExercises}");
                            return profile;
                        }
                    }
                    catch (Exception ex)
                    {
                        Debug.LogWarning($"[PatientDataManager] ReloadProfile error for {userId}: {ex.Message}");
                    }
                }
            }

            return profile ?? GetOrCreateProfile(userId, "Patient");
        }

        public string GetPatientJsonPath(string userId)
        {
            if (string.IsNullOrEmpty(storageFolderPath))
            {
                storageFolderPath = Path.Combine(Application.persistentDataPath, "PatientData");
                if (!Directory.Exists(storageFolderPath))
                {
                    Directory.CreateDirectory(storageFolderPath);
                }
            }
            return Path.Combine(storageFolderPath, $"{userId}.json");
        }

        public PatientProfile GetActiveProfile()
        {
            return activeProfile;
        }

        public void SetActivePatient(string userId, string userName = "")
        {
            activeProfile = GetOrCreateProfile(userId, userName);
            Debug.Log($"[PatientDataManager] Active Patient set to: {activeProfile.patientName} (ID: {activeProfile.userId})");
        }

        public void SetActiveProfile(PatientProfile profile)
        {
            if (profile == null) return;
            activeProfile = profile;
            Debug.Log($"[PatientDataManager] Active Patient set to: {activeProfile.patientName} (ID: {activeProfile.userId})");
        }

        private bool isNotifying = false;

        public void SaveProfile(PatientProfile profile)
        {
            if (profile == null || string.IsNullOrEmpty(profile.userId)) return;

            string filePath = GetPatientJsonPath(profile.userId);
            string firebaseJson = profile.ToFirebaseJson();

            try
            {
                File.WriteAllText(filePath, firebaseJson);
                Debug.Log($"[PatientDataManager] Saved JSON to disk -> {filePath}");
            }
            catch (Exception ex)
            {
                Debug.LogError($"[PatientDataManager] Failed to write JSON file for {profile.userId}: {ex.Message}");
            }

            if (!isNotifying)
            {
                try
                {
                    isNotifying = true;
                    OnPatientDataUpdated?.Invoke(profile);
                }
                finally
                {
                    isNotifying = false;
                }
            }
        }

        public void UpdatePatientProgress(string userId, int xpGained, int completedCount, int totalSessions = 0, string highScoresJson = null, string progressJson = null, int accuracy = 100, string highAccuraciesJson = null)
        {
            PatientProfile profile = patientProfiles.Find(p => p.userId == userId);
            if (profile == null)
            {
                profile = GetOrCreateProfile(userId, $"Patient {userId}");
            }

            if (profile != null)
            {
                profile.totalXP = Mathf.Max(profile.totalXP, xpGained);
                if (completedCount >= profile.totalCompletedExercises)
                {
                    profile.totalCompletedExercises = completedCount;
                }
                if (totalSessions >= profile.totalSessions)
                {
                    profile.totalSessions = totalSessions;
                }
                if (accuracy > 0)
                {
                    profile.averageAccuracy = accuracy;
                }
                if (!string.IsNullOrEmpty(highScoresJson) && highScoresJson != "{}" && highScoresJson != "{\"trace_letter\":{},\"colour_fill\":{},\"tap_object\":{},\"memory\":{},\"object_recall\":{},\"odd_one_out\":{},\"task_switching\":{},\"sorting\":{},\"falling_catcher\":{},\"word_association\":{},\"color_confusion\":{},\"quick_switch\":{},\"eagle_eye\":{},\"turnabout\":{},\"turning_tables\":{},\"quick_count\":{}}")
                {
                    profile.highScoresJson = highScoresJson;
                }
                if (!string.IsNullOrEmpty(progressJson) && progressJson != "{}")
                {
                    profile.progressJson = progressJson;
                }
                if (!string.IsNullOrEmpty(highAccuraciesJson) && highAccuraciesJson != "{}" && highAccuraciesJson != "{\"trace_letter\":{},\"colour_fill\":{},\"tap_object\":{},\"memory\":{},\"object_recall\":{},\"odd_one_out\":{},\"task_switching\":{},\"sorting\":{},\"falling_catcher\":{},\"word_association\":{},\"color_confusion\":{},\"quick_switch\":{},\"eagle_eye\":{},\"turnabout\":{},\"turning_tables\":{},\"quick_count\":{}}")
                {
                    profile.highAccuraciesJson = highAccuraciesJson;
                }
                profile.lastActiveDate = DateTime.Now.ToString("yyyy-MM-dd");

                if (activeProfile == null || activeProfile.userId == userId)
                {
                    activeProfile = profile;
                }

                // Automatically save updated progress to JSON file on disk
                SaveProfile(profile);
            }
        }
    }
}
