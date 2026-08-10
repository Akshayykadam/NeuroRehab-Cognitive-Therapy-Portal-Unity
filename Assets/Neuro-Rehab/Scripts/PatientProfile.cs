using System;
using UnityEngine;

namespace NeuroRehab
{
    [Serializable]
    public class PatientProfile
    {
        public string userId;
        public string patientName;
        public int totalXP;
        public int totalCompletedExercises;
        public int averageAccuracy = 100;
        public int totalSessions;
        public string lastActiveDate;
        public string updatedAtIso;

        // Raw JSON payloads for high scores, progress & accuracies ready for Firebase
        public string highScoresJson = "{}";
        public string progressJson = "{}";
        public string highAccuraciesJson = "{}";

        public PatientProfile()
        {
            userId = "10114";
            patientName = "Akshay Kadam";
            totalXP = 0;
            totalCompletedExercises = 0;
            averageAccuracy = 100;
            totalSessions = 0;
            lastActiveDate = DateTime.Now.ToString("yyyy-MM-dd");
            updatedAtIso = DateTime.UtcNow.ToString("o");
        }

        public PatientProfile(string id, string name, int xp = 0)
        {
            userId = id;
            patientName = name;
            totalXP = xp;
            totalCompletedExercises = 0;
            averageAccuracy = 100;
            totalSessions = 0;
            lastActiveDate = DateTime.Now.ToString("yyyy-MM-dd");
            updatedAtIso = DateTime.UtcNow.ToString("o");
        }

        public string ToFirebaseJson()
        {
            updatedAtIso = DateTime.UtcNow.ToString("o");
            return JsonUtility.ToJson(this, true);
        }

        public int GetOverallProgressPercentage()
        {
            int totalClearedLevels = 0;
            string[] gameIds = new string[] {
                "trace_letter", "colour_fill", "tap_object", "memory", "object_recall",
                "odd_one_out", "task_switching", "sorting", "falling_catcher",
                "word_association", "color_confusion", "quick_switch", "eagle_eye",
                "turnabout", "turning_tables", "quick_count"
            };

            foreach (string g in gameIds)
            {
                int unlockedLvl = ExtractLevelFromProgressJson(g);
                if (unlockedLvl > 1)
                {
                    totalClearedLevels += (unlockedLvl - 1);
                }
            }

            // 16 games * 50 levels per game = 800 total possible levels
            int totalPossibleLevels = 16 * 50;
            int percent = Mathf.RoundToInt(((float)totalClearedLevels / (float)totalPossibleLevels) * 100f);
            return Mathf.Clamp(percent, 0, 100);
        }

        private int ExtractLevelFromProgressJson(string gameId)
        {
            if (string.IsNullOrEmpty(progressJson)) return 1;
            string searchKey = $"\"{gameId}\":";
            int idx = progressJson.IndexOf(searchKey);
            if (idx < 0) return 1;
            int start = idx + searchKey.Length;
            int end = progressJson.IndexOfAny(new char[] { ',', '}' }, start);
            if (end < 0) end = progressJson.Length;
            string valStr = progressJson.Substring(start, end - start).Trim();
            if (int.TryParse(valStr, out int lvl))
            {
                return lvl;
            }
            return 1;
        }
    }
}
