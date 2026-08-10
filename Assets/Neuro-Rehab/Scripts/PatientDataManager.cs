using System;
using System.Collections.Generic;
using System.IO;
using UnityEngine;

namespace NeuroRehab
{
    public class PatientDataManager : MonoBehaviour
    {
        public static PatientDataManager Instance { get; private set; }

        public event Action<PatientProfile> OnPatientDataUpdated;

        private List<PatientProfile> patientProfiles = new List<PatientProfile>();
        private PatientProfile activeProfile;

        private string storageFolderPath;

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
            DontDestroyOnLoad(gameObject);

            // Establish dedicated JSON storage directory for Firebase pushing
            storageFolderPath = Path.Combine(Application.persistentDataPath, "PatientData");
            if (!Directory.Exists(storageFolderPath))
            {
                Directory.CreateDirectory(storageFolderPath);
            }

            Debug.Log($"[PatientDataManager] Firebase JSON Storage Directory: {storageFolderPath}");
        }

        private static readonly object fileLock = new object();

        public PatientProfile GetOrCreateProfile(string userId, string userName, int defaultXp = 0)
        {
            if (string.IsNullOrEmpty(userId)) userId = "10114";
            if (string.IsNullOrEmpty(userName)) userName = "Akshay Kadam";

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
                            if (loadedDisk.patientName == "Akshay" || string.IsNullOrEmpty(loadedDisk.patientName))
                            {
                                loadedDisk.patientName = "Akshay Kadam";
                            }

                            if (profile != null)
                            {
                                profile.patientName = loadedDisk.patientName;
                                profile.totalXP = loadedDisk.totalXP;
                                profile.totalCompletedExercises = loadedDisk.totalCompletedExercises;
                                profile.averageAccuracy = loadedDisk.averageAccuracy;
                                profile.totalSessions = loadedDisk.totalSessions;
                                profile.lastActiveDate = loadedDisk.lastActiveDate;
                                profile.highScoresJson = loadedDisk.highScoresJson;
                                profile.progressJson = loadedDisk.progressJson;
                                profile.highAccuraciesJson = loadedDisk.highAccuraciesJson;
                            }
                            else
                            {
                                profile = loadedDisk;
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
                        if (resProfile.patientName == "Akshay" || string.IsNullOrEmpty(resProfile.patientName))
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
            if (profile != null) return profile;

            PatientProfile newProfile = new PatientProfile(userId, userName, defaultXp);
            patientProfiles.Add(newProfile);
            SaveProfile(newProfile);

            return newProfile;
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

        public void SetActivePatient(string userId)
        {
            activeProfile = GetOrCreateProfile(userId, "Akshay Kadam");
            Debug.Log($"[PatientDataManager] Active Patient set to: {activeProfile.patientName} (ID: {activeProfile.userId})");
            SaveProfile(activeProfile);
        }

        public void SetActiveProfile(PatientProfile profile)
        {
            activeProfile = profile;
            if (activeProfile != null)
            {
                Debug.Log($"[PatientDataManager] Active Patient set to: {activeProfile.patientName} (ID: {activeProfile.userId})");
                SaveProfile(activeProfile);
            }
        }

        public void SaveProfile(PatientProfile profile)
        {
            if (profile == null || string.IsNullOrEmpty(profile.userId)) return;

            string filePath = GetPatientJsonPath(profile.userId);
            string firebaseJson = profile.ToFirebaseJson();

            lock (fileLock)
            {
                for (int attempt = 0; attempt < 5; attempt++)
                {
                    try
                    {
                        using (FileStream fs = new FileStream(filePath, FileMode.Create, FileAccess.Write, FileShare.ReadWrite))
                        using (StreamWriter writer = new StreamWriter(fs))
                        {
                            writer.Write(firebaseJson);
                        }
                        Debug.Log($"[PatientDataManager] Automatically Created/Updated JSON on disk for Firebase -> {filePath}");
                        break;
                    }
                    catch (IOException)
                    {
                        if (attempt == 4)
                        {
                            Debug.LogWarning($"[PatientDataManager] Lock timeout writing JSON file for {profile.userId}");
                        }
                        else
                        {
                            System.Threading.Thread.Sleep(30);
                        }
                    }
                    catch (Exception ex)
                    {
                        Debug.LogError($"[PatientDataManager] Failed to write JSON file for {profile.userId}: {ex.Message}");
                        break;
                    }
                }
            }

            OnPatientDataUpdated?.Invoke(profile);
        }

        public void UpdatePatientProgress(string userId, int xpGained, int completedCount, int totalSessions = 0, string highScoresJson = null, string progressJson = null, int accuracy = 100, string highAccuraciesJson = null)
        {
            PatientProfile profile = patientProfiles.Find(p => p.userId == userId);
            if (profile == null)
            {
                profile = GetOrCreateProfile(userId, "Akshay Kadam");
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

                // Automatically save updated progress to JSON file on disk
                SaveProfile(profile);
            }
        }
    }
}
