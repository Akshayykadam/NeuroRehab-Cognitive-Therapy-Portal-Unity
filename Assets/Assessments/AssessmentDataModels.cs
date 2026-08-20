using System;
using System.Collections.Generic;
using UnityEngine;

namespace NeuroRehab
{
    [Serializable]
    public class AssessmentQuestionDetail
    {
        public int questionIndex;
        public string section = "";
        public string title = "";
        public int selectedScore = -1;
        public string selectedAnswerText = "";
    }

    [Serializable]
    public class AssessmentSessionRecord
    {
        public string sessionId = "";
        public string assessmentType = ""; // e.g. "MiniBEST", "FMAUE"
        public string startDateTime = "";   // "yyyy-MM-dd HH:mm:ss"
        public string lastUpdatedDateTime = ""; // "yyyy-MM-dd HH:mm:ss"
        public string completedDateTime = "";   // "yyyy-MM-dd HH:mm:ss"
        public string date = "";            // "yyyy-MM-dd"
        public string time = "";            // "HH:mm:ss"
        public bool isCompleted = false;
        public int currentQuestionIndex = 0;
        public List<int> selectedScores = new List<int>();
        public int totalScore = 0;
        public int maxScore = 0;
        public float percentage = 0f;
        public List<AssessmentQuestionDetail> questionDetails = new List<AssessmentQuestionDetail>();

        public AssessmentSessionRecord()
        {
            sessionId = Guid.NewGuid().ToString();
            DateTime now = DateTime.Now;
            startDateTime = now.ToString("yyyy-MM-dd HH:mm:ss");
            lastUpdatedDateTime = startDateTime;
            date = now.ToString("yyyy-MM-dd");
            time = now.ToString("HH:mm:ss");
            isCompleted = false;
            currentQuestionIndex = 0;
            selectedScores = new List<int>();
            questionDetails = new List<AssessmentQuestionDetail>();
        }

        public AssessmentSessionRecord(string type, int questionCount)
        {
            sessionId = Guid.NewGuid().ToString();
            assessmentType = type;
            DateTime now = DateTime.Now;
            startDateTime = now.ToString("yyyy-MM-dd HH:mm:ss");
            lastUpdatedDateTime = startDateTime;
            date = now.ToString("yyyy-MM-dd");
            time = now.ToString("HH:mm:ss");
            isCompleted = false;
            currentQuestionIndex = 0;
            selectedScores = new List<int>();
            for (int i = 0; i < questionCount; i++)
            {
                selectedScores.Add(-1);
            }
            questionDetails = new List<AssessmentQuestionDetail>();
        }
    }

    [Serializable]
    public class UserAssessmentData
    {
        public string userId = "";
        public string userName = "";
        public string lastUpdated = "";
        public List<AssessmentSessionRecord> assessments = new List<AssessmentSessionRecord>();

        public UserAssessmentData()
        {
            userId = "1001";
            userName = "Patient Name";
            lastUpdated = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            assessments = new List<AssessmentSessionRecord>();
        }

        public UserAssessmentData(string id, string name)
        {
            userId = id;
            userName = name;
            lastUpdated = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            assessments = new List<AssessmentSessionRecord>();
        }

        public string ToJson(bool prettyPrint = true)
        {
            lastUpdated = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            return JsonUtility.ToJson(this, prettyPrint);
        }

        public static UserAssessmentData FromJson(string json)
        {
            if (string.IsNullOrEmpty(json)) return null;
            return JsonUtility.FromJson<UserAssessmentData>(json);
        }
    }
}
