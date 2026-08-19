using System.Collections.Generic;

/// <summary>
/// MiniBEST Test System – 14 questions across 4 sections.
/// All display text is resolved via LocalisationManager from CSV keys.
/// Images are loaded automatically by ClinicalAssessmentManager from:
///   Assets/Resources/AssessmentImages/MiniBEST/Q1.png … Q14.png
/// </summary>
public static class MiniBESTAssessment
{
    public static List<ClinicalAssessmentManager.Question> CreateQuestions()
    {
        var questions = new List<ClinicalAssessmentManager.Question>();
        ClinicalAssessmentManager.Question q;

        // ---------------------------------------------------------------
        // SECTION 1 – ANTICIPATORY
        // ---------------------------------------------------------------

        // 1. Sit to Stand
        q = new ClinicalAssessmentManager.Question(
            LocalisationManager.Get("MB_S1_Section"),
            LocalisationManager.Get("MB_Q1_Title"),
            LocalisationManager.Get("MB_Q1_Instruction")
        );
        q.Answers.Add(new ClinicalAssessmentManager.Answer(0, LocalisationManager.Get("MB_Q1_A0")));
        q.Answers.Add(new ClinicalAssessmentManager.Answer(1, LocalisationManager.Get("MB_Q1_A1")));
        q.Answers.Add(new ClinicalAssessmentManager.Answer(2, LocalisationManager.Get("MB_Q1_A2")));
        questions.Add(q);

        // 2. Rise to Toes
        q = new ClinicalAssessmentManager.Question(
            LocalisationManager.Get("MB_S1_Section"),
            LocalisationManager.Get("MB_Q2_Title"),
            LocalisationManager.Get("MB_Q2_Instruction")
        );
        q.Answers.Add(new ClinicalAssessmentManager.Answer(0, LocalisationManager.Get("MB_Q2_A0")));
        q.Answers.Add(new ClinicalAssessmentManager.Answer(1, LocalisationManager.Get("MB_Q2_A1")));
        q.Answers.Add(new ClinicalAssessmentManager.Answer(2, LocalisationManager.Get("MB_Q2_A2")));
        questions.Add(q);

        // 3. Stand on One Leg
        q = new ClinicalAssessmentManager.Question(
            LocalisationManager.Get("MB_S1_Section"),
            LocalisationManager.Get("MB_Q3_Title"),
            LocalisationManager.Get("MB_Q3_Instruction")
        );
        q.Answers.Add(new ClinicalAssessmentManager.Answer(0, LocalisationManager.Get("MB_Q3_A0")));
        q.Answers.Add(new ClinicalAssessmentManager.Answer(1, LocalisationManager.Get("MB_Q3_A1")));
        q.Answers.Add(new ClinicalAssessmentManager.Answer(2, LocalisationManager.Get("MB_Q3_A2")));
        questions.Add(q);

        // ---------------------------------------------------------------
        // SECTION 2 – REACTIVE POSTURAL CONTROL
        // ---------------------------------------------------------------

        // 4. Forward Stepping Correction
        q = new ClinicalAssessmentManager.Question(
            LocalisationManager.Get("MB_S2_Section"),
            LocalisationManager.Get("MB_Q4_Title"),
            LocalisationManager.Get("MB_Q4_Instruction")
        );
        q.Answers.Add(new ClinicalAssessmentManager.Answer(0, LocalisationManager.Get("MB_Q4_A0")));
        q.Answers.Add(new ClinicalAssessmentManager.Answer(1, LocalisationManager.Get("MB_Q4_A1")));
        q.Answers.Add(new ClinicalAssessmentManager.Answer(2, LocalisationManager.Get("MB_Q4_A2")));
        questions.Add(q);

        // 5. Backward Stepping Correction
        q = new ClinicalAssessmentManager.Question(
            LocalisationManager.Get("MB_S2_Section"),
            LocalisationManager.Get("MB_Q5_Title"),
            LocalisationManager.Get("MB_Q5_Instruction")
        );
        q.Answers.Add(new ClinicalAssessmentManager.Answer(0, LocalisationManager.Get("MB_Q5_A0")));
        q.Answers.Add(new ClinicalAssessmentManager.Answer(1, LocalisationManager.Get("MB_Q5_A1")));
        q.Answers.Add(new ClinicalAssessmentManager.Answer(2, LocalisationManager.Get("MB_Q5_A2")));
        questions.Add(q);

        // 6. Lateral Stepping Correction
        q = new ClinicalAssessmentManager.Question(
            LocalisationManager.Get("MB_S2_Section"),
            LocalisationManager.Get("MB_Q6_Title"),
            LocalisationManager.Get("MB_Q6_Instruction")
        );
        q.Answers.Add(new ClinicalAssessmentManager.Answer(0, LocalisationManager.Get("MB_Q6_A0")));
        q.Answers.Add(new ClinicalAssessmentManager.Answer(1, LocalisationManager.Get("MB_Q6_A1")));
        q.Answers.Add(new ClinicalAssessmentManager.Answer(2, LocalisationManager.Get("MB_Q6_A2")));
        questions.Add(q);

        // ---------------------------------------------------------------
        // SECTION 3 – SENSORY ORIENTATION
        // ---------------------------------------------------------------

        // 7. Feet Together Eyes Open
        q = new ClinicalAssessmentManager.Question(
            LocalisationManager.Get("MB_S3_Section"),
            LocalisationManager.Get("MB_Q7_Title"),
            LocalisationManager.Get("MB_Q7_Instruction")
        );
        q.Answers.Add(new ClinicalAssessmentManager.Answer(0, LocalisationManager.Get("MB_Q7_A0")));
        q.Answers.Add(new ClinicalAssessmentManager.Answer(1, LocalisationManager.Get("MB_Q7_A1")));
        q.Answers.Add(new ClinicalAssessmentManager.Answer(2, LocalisationManager.Get("MB_Q7_A2")));
        questions.Add(q);

        // 8. Eyes Closed on Foam
        q = new ClinicalAssessmentManager.Question(
            LocalisationManager.Get("MB_S3_Section"),
            LocalisationManager.Get("MB_Q8_Title"),
            LocalisationManager.Get("MB_Q8_Instruction")
        );
        q.Answers.Add(new ClinicalAssessmentManager.Answer(0, LocalisationManager.Get("MB_Q8_A0")));
        q.Answers.Add(new ClinicalAssessmentManager.Answer(1, LocalisationManager.Get("MB_Q8_A1")));
        q.Answers.Add(new ClinicalAssessmentManager.Answer(2, LocalisationManager.Get("MB_Q8_A2")));
        questions.Add(q);

        // 9. Incline Eyes Closed
        q = new ClinicalAssessmentManager.Question(
            LocalisationManager.Get("MB_S3_Section"),
            LocalisationManager.Get("MB_Q9_Title"),
            LocalisationManager.Get("MB_Q9_Instruction")
        );
        q.Answers.Add(new ClinicalAssessmentManager.Answer(0, LocalisationManager.Get("MB_Q9_A0")));
        q.Answers.Add(new ClinicalAssessmentManager.Answer(1, LocalisationManager.Get("MB_Q9_A1")));
        q.Answers.Add(new ClinicalAssessmentManager.Answer(2, LocalisationManager.Get("MB_Q9_A2")));
        questions.Add(q);

        // ---------------------------------------------------------------
        // SECTION 4 – DYNAMIC GAIT
        // ---------------------------------------------------------------

        // 10. Change Gait Speed
        q = new ClinicalAssessmentManager.Question(
            LocalisationManager.Get("MB_S4_Section"),
            LocalisationManager.Get("MB_Q10_Title"),
            LocalisationManager.Get("MB_Q10_Instruction")
        );
        q.Answers.Add(new ClinicalAssessmentManager.Answer(0, LocalisationManager.Get("MB_Q10_A0")));
        q.Answers.Add(new ClinicalAssessmentManager.Answer(1, LocalisationManager.Get("MB_Q10_A1")));
        q.Answers.Add(new ClinicalAssessmentManager.Answer(2, LocalisationManager.Get("MB_Q10_A2")));
        questions.Add(q);

        // 11. Walk with Head Turns
        q = new ClinicalAssessmentManager.Question(
            LocalisationManager.Get("MB_S4_Section"),
            LocalisationManager.Get("MB_Q11_Title"),
            LocalisationManager.Get("MB_Q11_Instruction")
        );
        q.Answers.Add(new ClinicalAssessmentManager.Answer(0, LocalisationManager.Get("MB_Q11_A0")));
        q.Answers.Add(new ClinicalAssessmentManager.Answer(1, LocalisationManager.Get("MB_Q11_A1")));
        q.Answers.Add(new ClinicalAssessmentManager.Answer(2, LocalisationManager.Get("MB_Q11_A2")));
        questions.Add(q);

        // 12. Pivot Turn
        q = new ClinicalAssessmentManager.Question(
            LocalisationManager.Get("MB_S4_Section"),
            LocalisationManager.Get("MB_Q12_Title"),
            LocalisationManager.Get("MB_Q12_Instruction")
        );
        q.Answers.Add(new ClinicalAssessmentManager.Answer(0, LocalisationManager.Get("MB_Q12_A0")));
        q.Answers.Add(new ClinicalAssessmentManager.Answer(1, LocalisationManager.Get("MB_Q12_A1")));
        q.Answers.Add(new ClinicalAssessmentManager.Answer(2, LocalisationManager.Get("MB_Q12_A2")));
        questions.Add(q);

        // 13. Step Over Obstacle
        q = new ClinicalAssessmentManager.Question(
            LocalisationManager.Get("MB_S4_Section"),
            LocalisationManager.Get("MB_Q13_Title"),
            LocalisationManager.Get("MB_Q13_Instruction")
        );
        q.Answers.Add(new ClinicalAssessmentManager.Answer(0, LocalisationManager.Get("MB_Q13_A0")));
        q.Answers.Add(new ClinicalAssessmentManager.Answer(1, LocalisationManager.Get("MB_Q13_A1")));
        q.Answers.Add(new ClinicalAssessmentManager.Answer(2, LocalisationManager.Get("MB_Q13_A2")));
        questions.Add(q);

        // 14. Timed Up and Go Dual Task
        q = new ClinicalAssessmentManager.Question(
            LocalisationManager.Get("MB_S4_Section"),
            LocalisationManager.Get("MB_Q14_Title"),
            LocalisationManager.Get("MB_Q14_Instruction")
        );
        q.Answers.Add(new ClinicalAssessmentManager.Answer(0, LocalisationManager.Get("MB_Q14_A0")));
        q.Answers.Add(new ClinicalAssessmentManager.Answer(1, LocalisationManager.Get("MB_Q14_A1")));
        q.Answers.Add(new ClinicalAssessmentManager.Answer(2, LocalisationManager.Get("MB_Q14_A2")));
        questions.Add(q);

        return questions;
    }
}
