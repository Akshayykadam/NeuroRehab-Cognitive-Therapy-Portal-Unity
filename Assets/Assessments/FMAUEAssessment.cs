// Images loaded automatically by ClinicalAssessmentManager from:
//   Assets/Resources/AssessmentImages/FMAUE/Q1.png … QN.png
// All display text is resolved via LocalisationManager from CSV keys.

using System.Collections.Generic;

public static class FMAUEAssessment
{
    public static List<ClinicalAssessmentManager.Question> CreateQuestions()
    {
        List<ClinicalAssessmentManager.Question> questions =
            new List<ClinicalAssessmentManager.Question>();

        ClinicalAssessmentManager.Question q;

        // ====================================================
        // A. UPPER EXTREMITY
        // ====================================================

        // I. Reflex Activity

        // Flexors
        q = new ClinicalAssessmentManager.Question(
            LocalisationManager.Get("FM_SA_Section"),
            LocalisationManager.Get("FM_Q1_Title"),
            LocalisationManager.Get("FM_Q1_Instruction")
        );
        q.Answers.Add(new ClinicalAssessmentManager.Answer(0, LocalisationManager.Get("FM_Q1_A0")));
        q.Answers.Add(new ClinicalAssessmentManager.Answer(2, LocalisationManager.Get("FM_Q1_A2")));
        questions.Add(q);

        // Extensors
        q = new ClinicalAssessmentManager.Question(
            LocalisationManager.Get("FM_SA_Section"),
            LocalisationManager.Get("FM_Q2_Title"),
            LocalisationManager.Get("FM_Q2_Instruction")
        );
        q.Answers.Add(new ClinicalAssessmentManager.Answer(0, LocalisationManager.Get("FM_Q2_A0")));
        q.Answers.Add(new ClinicalAssessmentManager.Answer(2, LocalisationManager.Get("FM_Q2_A2")));
        questions.Add(q);

        // II. Volitional Movement Within Synergies – Flexor Synergy

        // Shoulder Retraction
        AddUEQuestion(questions, "FM_SA_Section", "FM_Q3_Title", "FM_Q3_Instruction", "FM_Q3");

        // Shoulder Elevation
        AddUEQuestion(questions, "FM_SA_Section", "FM_Q4_Title", "FM_Q4_Instruction", "FM_Q4");

        // Shoulder Abduction (90°)
        AddUEQuestion(questions, "FM_SA_Section", "FM_Q5_Title", "FM_Q5_Instruction", "FM_Q5");

        // Shoulder External Rotation
        AddUEQuestion(questions, "FM_SA_Section", "FM_Q6_Title", "FM_Q6_Instruction", "FM_Q6");

        // Elbow Flexion
        AddUEQuestion(questions, "FM_SA_Section", "FM_Q7_Title", "FM_Q7_Instruction", "FM_Q7");

        // Forearm Supination
        AddUEQuestion(questions, "FM_SA_Section", "FM_Q8_Title", "FM_Q8_Instruction", "FM_Q8");

        // II. Volitional Movement Within Synergies – Extensor Synergy

        // Shoulder Adduction / Internal Rotation
        AddUEQuestion(questions, "FM_SA_Section", "FM_Q9_Title", "FM_Q9_Instruction", "FM_Q9");

        // Elbow Extension
        AddUEQuestion(questions, "FM_SA_Section", "FM_Q10_Title", "FM_Q10_Instruction", "FM_Q10");

        // Forearm Pronation
        AddUEQuestion(questions, "FM_SA_Section", "FM_Q11_Title", "FM_Q11_Instruction", "FM_Q11");

        // III. Volitional Movement Mixing Synergies

        // Hand to Lumbar Spine
        AddUEQuestion(questions, "FM_SA_Section", "FM_Q12_Title", "FM_Q12_Instruction", "FM_Q12");

        // Shoulder Flexion 0° - 90°
        AddUEQuestion(questions, "FM_SA_Section", "FM_Q13_Title", "FM_Q13_Instruction", "FM_Q13");

        // Pronation / Supination (Elbow 90°)
        AddUEQuestion(questions, "FM_SA_Section", "FM_Q14_Title", "FM_Q14_Instruction", "FM_Q14");

        // IV. Volitional Movement with Little or No Synergy

        // Shoulder Abduction 0° - 90°
        AddUEQuestion(questions, "FM_SA_Section", "FM_Q15_Title", "FM_Q15_Instruction", "FM_Q15");

        // Shoulder Flexion 90° - 180°
        AddUEQuestion(questions, "FM_SA_Section", "FM_Q16_Title", "FM_Q16_Instruction", "FM_Q16");

        // Pronation / Supination (Elbow Extended)
        AddUEQuestion(questions, "FM_SA_Section", "FM_Q17_Title", "FM_Q17_Instruction", "FM_Q17");

        // V. Normal Reflex Activity
        AddUEQuestion(questions, "FM_SA_Section", "FM_Q18_Title", "FM_Q18_Instruction", "FM_Q18");

        // ====================================================
        // B. WRIST
        // ====================================================

        AddUEQuestion(questions, "FM_SB_Section", "FM_Q19_Title", "FM_Q19_Instruction", "FM_Q19");
        AddUEQuestion(questions, "FM_SB_Section", "FM_Q20_Title", "FM_Q20_Instruction", "FM_Q20");
        AddUEQuestion(questions, "FM_SB_Section", "FM_Q21_Title", "FM_Q21_Instruction", "FM_Q21");
        AddUEQuestion(questions, "FM_SB_Section", "FM_Q22_Title", "FM_Q22_Instruction", "FM_Q22");
        AddUEQuestion(questions, "FM_SB_Section", "FM_Q23_Title", "FM_Q23_Instruction", "FM_Q23");

        // ====================================================
        // C. HAND
        // ====================================================

        AddUEQuestion(questions, "FM_SC_Section", "FM_Q24_Title", "FM_Q24_Instruction", "FM_Q24");
        AddUEQuestion(questions, "FM_SC_Section", "FM_Q25_Title", "FM_Q25_Instruction", "FM_Q25");
        AddUEQuestion(questions, "FM_SC_Section", "FM_Q26_Title", "FM_Q26_Instruction", "FM_Q26");
        AddUEQuestion(questions, "FM_SC_Section", "FM_Q27_Title", "FM_Q27_Instruction", "FM_Q27");
        AddUEQuestion(questions, "FM_SC_Section", "FM_Q28_Title", "FM_Q28_Instruction", "FM_Q28");
        AddUEQuestion(questions, "FM_SC_Section", "FM_Q29_Title", "FM_Q29_Instruction", "FM_Q29");
        AddUEQuestion(questions, "FM_SC_Section", "FM_Q30_Title", "FM_Q30_Instruction", "FM_Q30");

        // ====================================================
        // D. COORDINATION / SPEED
        // ====================================================

        AddUEQuestion(questions, "FM_SD_Section", "FM_Q31_Title", "FM_Q31_Instruction", "FM_Q31");
        AddUEQuestion(questions, "FM_SD_Section", "FM_Q32_Title", "FM_Q32_Instruction", "FM_Q32");
        AddUEQuestion(questions, "FM_SD_Section", "FM_Q33_Title", "FM_Q33_Instruction", "FM_Q33");

        // ====================================================
        // H. SENSATION
        // ====================================================

        AddUEQuestion(questions, "FM_SH_Section", "FM_Q34_Title", "FM_Q34_Instruction", "FM_Q34");
        AddUEQuestion(questions, "FM_SH_Section", "FM_Q35_Title", "FM_Q35_Instruction", "FM_Q35");
        AddUEQuestion(questions, "FM_SH_Section", "FM_Q36_Title", "FM_Q36_Instruction", "FM_Q36");
        AddUEQuestion(questions, "FM_SH_Section", "FM_Q37_Title", "FM_Q37_Instruction", "FM_Q37");
        AddUEQuestion(questions, "FM_SH_Section", "FM_Q38_Title", "FM_Q38_Instruction", "FM_Q38");
        AddUEQuestion(questions, "FM_SH_Section", "FM_Q39_Title", "FM_Q39_Instruction", "FM_Q39");
        AddUEQuestion(questions, "FM_SH_Section", "FM_Q40_Title", "FM_Q40_Instruction", "FM_Q40");

        // ====================================================
        // J. PASSIVE JOINT MOTION
        // ====================================================

        AddUEQuestion(questions, "FM_SJ1_Section", "FM_Q41_Title", "FM_Q41_Instruction", "FM_Q41");
        AddUEQuestion(questions, "FM_SJ1_Section", "FM_Q42_Title", "FM_Q42_Instruction", "FM_Q42");
        AddUEQuestion(questions, "FM_SJ1_Section", "FM_Q43_Title", "FM_Q43_Instruction", "FM_Q43");
        AddUEQuestion(questions, "FM_SJ1_Section", "FM_Q44_Title", "FM_Q44_Instruction", "FM_Q44");
        AddUEQuestion(questions, "FM_SJ1_Section", "FM_Q45_Title", "FM_Q45_Instruction", "FM_Q45");
        AddUEQuestion(questions, "FM_SJ1_Section", "FM_Q46_Title", "FM_Q46_Instruction", "FM_Q46");
        AddUEQuestion(questions, "FM_SJ1_Section", "FM_Q47_Title", "FM_Q47_Instruction", "FM_Q47");
        AddUEQuestion(questions, "FM_SJ1_Section", "FM_Q48_Title", "FM_Q48_Instruction", "FM_Q48");
        AddUEQuestion(questions, "FM_SJ1_Section", "FM_Q49_Title", "FM_Q49_Instruction", "FM_Q49");
        AddUEQuestion(questions, "FM_SJ1_Section", "FM_Q50_Title", "FM_Q50_Instruction", "FM_Q50");
        AddUEQuestion(questions, "FM_SJ1_Section", "FM_Q51_Title", "FM_Q51_Instruction", "FM_Q51");
        AddUEQuestion(questions, "FM_SJ1_Section", "FM_Q52_Title", "FM_Q52_Instruction", "FM_Q52");

        // ====================================================
        // J. JOINT PAIN
        // ====================================================

        AddUEQuestion(questions, "FM_SJ2_Section", "FM_Q53_Title", "FM_Q53_Instruction", "FM_Q53");
        AddUEQuestion(questions, "FM_SJ2_Section", "FM_Q54_Title", "FM_Q54_Instruction", "FM_Q54");
        AddUEQuestion(questions, "FM_SJ2_Section", "FM_Q55_Title", "FM_Q55_Instruction", "FM_Q55");
        AddUEQuestion(questions, "FM_SJ2_Section", "FM_Q56_Title", "FM_Q56_Instruction", "FM_Q56");
        AddUEQuestion(questions, "FM_SJ2_Section", "FM_Q57_Title", "FM_Q57_Instruction", "FM_Q57");
        AddUEQuestion(questions, "FM_SJ2_Section", "FM_Q58_Title", "FM_Q58_Instruction", "FM_Q58");
        AddUEQuestion(questions, "FM_SJ2_Section", "FM_Q59_Title", "FM_Q59_Instruction", "FM_Q59");
        AddUEQuestion(questions, "FM_SJ2_Section", "FM_Q60_Title", "FM_Q60_Instruction", "FM_Q60");
        AddUEQuestion(questions, "FM_SJ2_Section", "FM_Q61_Title", "FM_Q61_Instruction", "FM_Q61");
        AddUEQuestion(questions, "FM_SJ2_Section", "FM_Q62_Title", "FM_Q62_Instruction", "FM_Q62");
        AddUEQuestion(questions, "FM_SJ2_Section", "FM_Q63_Title", "FM_Q63_Instruction", "FM_Q63");
        AddUEQuestion(questions, "FM_SJ2_Section", "FM_Q64_Title", "FM_Q64_Instruction", "FM_Q64");

        return questions;
    }

    // ---------------------------------------------------------------
    // Helper – builds a standard 0/1/2 scored question from loc keys
    // ---------------------------------------------------------------
    private static void AddUEQuestion(
        List<ClinicalAssessmentManager.Question> questions,
        string sectionKey,
        string titleKey,
        string instructionKey,
        string answerPrefix)
    {
        ClinicalAssessmentManager.Question q = new ClinicalAssessmentManager.Question(
            LocalisationManager.Get(sectionKey),
            LocalisationManager.Get(titleKey),
            LocalisationManager.Get(instructionKey)
        );
        q.Answers.Add(new ClinicalAssessmentManager.Answer(0, LocalisationManager.Get(answerPrefix + "_A0")));
        q.Answers.Add(new ClinicalAssessmentManager.Answer(1, LocalisationManager.Get(answerPrefix + "_A1")));
        q.Answers.Add(new ClinicalAssessmentManager.Answer(2, LocalisationManager.Get(answerPrefix + "_A2")));
        questions.Add(q);
    }
}
