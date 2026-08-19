using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class ClinicalAssessmentManagerOld : MonoBehaviour
{
    [Serializable]
    public class Answer
    {
        public int score;
        [TextArea(2, 5)] public string text;

        public Answer(int newScore, string newText)
        {
            score = newScore;
            text = newText;
        }
    }

    [Serializable]
    public class Question
    {
        public string section;
        public string title;

        [TextArea(3, 8)]
        public string instruction;

        public Sprite image;
        public List<Answer> answers = new List<Answer>();

        public Question(string newSection, string newTitle, string newInstruction)
        {
            section = newSection;
            title = newTitle;
            instruction = newInstruction;
        }
    }

    [Header("UI References")]
    public Text sectionText;
    public Text titleText;
    public Text instructionText;
    public Image questionImage;

    public Transform answersPanel;
    public GameObject answerPrefab;

    public Text progressText;
    public Text totalText;

    [Header("Buttons")]
    public Button nextButton;
    public Button backButton;
    public Button submitButton;

    [Header("Optional")]
    public GameObject resultPanel;
    public Text finalScoreText;

    private List<Question> questions = new List<Question>();
    private List<int> selectedScores = new List<int>();

    private int currentQuestionIndex = 0;
    private ToggleGroup toggleGroup;

    private void Start()
    {

        CreateMiniBESTestQuestions();

        if (questions.Count == 0)
        {
            Debug.LogError("No assessment questions were created.");
            return;
        }

        if (answersPanel == null || answerPrefab == null)
        {
            Debug.LogError("Assign Answers Panel and Answer Prefab in the Inspector.");
            return;
        }

        toggleGroup = answersPanel.GetComponent<ToggleGroup>();

        if (toggleGroup == null)
        {
            toggleGroup = answersPanel.gameObject.AddComponent<ToggleGroup>();
        }

        toggleGroup.allowSwitchOff = true;

        selectedScores.Clear();

        for (int i = 0; i < questions.Count; i++)
        {
            selectedScores.Add(-1);
        }

        nextButton.onClick.RemoveAllListeners();
        backButton.onClick.RemoveAllListeners();
        submitButton.onClick.RemoveAllListeners();

        nextButton.onClick.AddListener(NextQuestion);
        backButton.onClick.AddListener(PreviousQuestion);
        submitButton.onClick.AddListener(SubmitAssessment);

        if (resultPanel != null)
        {
            resultPanel.SetActive(false);
        }

        ShowQuestion();
    }

    private void CreateMiniBESTestQuestions()
    {
        questions.Clear();

        // 1
        Question q1 = new Question(
            "ANTICIPATORY",
            "1. Sit to Stand",
            "Cross your arms across your chest. Try not to use your hands unless you must. Do not let your legs lean against the back of the chair when you stand. Please stand up now."
        );
        q1.answers.Add(new Answer(0, "Severe: Unable to stand up from chair without assistance, or needs several attempts with use of hands."));
        q1.answers.Add(new Answer(1, "Moderate: Comes to stand with use of hands on first attempt."));
        q1.answers.Add(new Answer(2, "Normal: Comes to stand without use of hands and stabilizes independently."));
        questions.Add(q1);

        // 2
        Question q2 = new Question(
            "ANTICIPATORY",
            "2. Rise to Toes",
            "Place your feet shoulder width apart. Place your hands on your hips. Try to rise as high as you can onto your toes. Hold this pose for at least 3 seconds. Look straight ahead."
        );
        q2.answers.Add(new Answer(0, "Severe: Less than 3 seconds."));
        q2.answers.Add(new Answer(1, "Moderate: Heels up but not full range, or noticeable instability for 3 seconds."));
        q2.answers.Add(new Answer(2, "Normal: Stable for 3 seconds with maximum height."));
        questions.Add(q2);

        // 3
        Question q3 = new Question(
            "ANTICIPATORY",
            "3. Stand on One Leg",
            "Look straight ahead. Keep your hands on your hips. Lift one leg behind you without touching the raised leg to the standing leg. Record the best time from two trials for each side. Use the worse side score."
        );
        q3.answers.Add(new Answer(0, "Severe: Unable to stand on one leg."));
        q3.answers.Add(new Answer(1, "Moderate: Holds less than 20 seconds."));
        q3.answers.Add(new Answer(2, "Normal: Holds for 20 seconds."));
        questions.Add(q3);

        // 4
        Question q4 = new Question(
            "REACTIVE POSTURAL CONTROL",
            "4. Compensatory Stepping Correction - Forward",
            "Stand with feet shoulder width apart and arms at sides. Lean forward against the examiner's hands beyond forward limits. When released, take whatever action is necessary to avoid a fall."
        );
        q4.answers.Add(new Answer(0, "Severe: No step, would fall if not caught, or falls spontaneously."));
        q4.answers.Add(new Answer(1, "Moderate: Uses more than one step to recover equilibrium."));
        q4.answers.Add(new Answer(2, "Normal: Recovers independently with one large step. A second realignment step is allowed."));
        questions.Add(q4);

        // 5
        Question q5 = new Question(
            "REACTIVE POSTURAL CONTROL",
            "5. Compensatory Stepping Correction - Backward",
            "Stand with feet shoulder width apart and arms at sides. Lean backward against the examiner's hands beyond backward limits. When released, take whatever action is necessary to avoid a fall."
        );
        q5.answers.Add(new Answer(0, "Severe: No step, would fall if not caught, or falls spontaneously."));
        q5.answers.Add(new Answer(1, "Moderate: Uses more than one step to recover equilibrium."));
        q5.answers.Add(new Answer(2, "Normal: Recovers independently with one large step."));
        questions.Add(q5);

        // 6
        Question q6 = new Question(
            "REACTIVE POSTURAL CONTROL",
            "6. Compensatory Stepping Correction - Lateral",
            "Stand with feet together and arms down. Lean into the examiner's hand beyond the sideways limit. When released, take whatever action is necessary to avoid a fall. Test both sides and use the worse score."
        );
        q6.answers.Add(new Answer(0, "Severe: Falls or cannot step."));
        q6.answers.Add(new Answer(1, "Moderate: Uses several steps to recover equilibrium."));
        q6.answers.Add(new Answer(2, "Normal: Recovers independently with one step. Crossover or lateral step is acceptable."));
        questions.Add(q6);

        // 7
        Question q7 = new Question(
            "SENSORY ORIENTATION",
            "7. Stance: Feet Together, Eyes Open, Firm Surface",
            "Place hands on hips. Place feet together until almost touching. Look straight ahead and remain as stable and still as possible until told to stop."
        );
        q7.answers.Add(new Answer(0, "Severe: Unable."));
        q7.answers.Add(new Answer(1, "Moderate: Holds less than 30 seconds."));
        q7.answers.Add(new Answer(2, "Normal: Holds for 30 seconds."));
        questions.Add(q7);

        // 8
        Question q8 = new Question(
            "SENSORY ORIENTATION",
            "8. Stance: Feet Together, Eyes Closed, Foam Surface",
            "Step onto the foam. Place hands on hips. Place feet together until almost touching. Remain stable and still. Start timing when the eyes close."
        );
        q8.answers.Add(new Answer(0, "Severe: Unable."));
        q8.answers.Add(new Answer(1, "Moderate: Holds less than 30 seconds."));
        q8.answers.Add(new Answer(2, "Normal: Holds for 30 seconds."));
        questions.Add(q8);

        // 9
        Question q9 = new Question(
            "SENSORY ORIENTATION",
            "9. Incline - Eyes Closed",
            "Stand on the incline ramp with toes toward the top. Keep feet shoulder width apart and arms at sides. Start timing when the eyes close."
        );
        q9.answers.Add(new Answer(0, "Severe: Unable."));
        q9.answers.Add(new Answer(1, "Moderate: Stands independently for less than 30 seconds, or aligns with the surface."));
        q9.answers.Add(new Answer(2, "Normal: Stands independently for 30 seconds and aligns with gravity."));
        questions.Add(q9);

        // 10
        Question q10 = new Question(
            "DYNAMIC GAIT",
            "10. Change in Gait Speed",
            "Walk at normal speed. On command, walk as fast as possible. On the next command, walk very slowly."
        );
        q10.answers.Add(new Answer(0, "Severe: Cannot achieve significant change in speed and shows imbalance."));
        q10.answers.Add(new Answer(1, "Moderate: Cannot change walking speed or shows signs of imbalance."));
        q10.answers.Add(new Answer(2, "Normal: Significantly changes walking speed without imbalance."));
        questions.Add(q10);

        // 11
        Question q11 = new Question(
            "DYNAMIC GAIT",
            "11. Walk with Head Turns - Horizontal",
            "Walk at normal speed. On command, turn the head right and left while trying to continue walking in a straight line."
        );
        q11.answers.Add(new Answer(0, "Severe: Performs head turns with imbalance."));
        q11.answers.Add(new Answer(1, "Moderate: Performs head turns with reduced gait speed."));
        q11.answers.Add(new Answer(2, "Normal: Performs head turns with no change in gait speed and good balance."));
        questions.Add(q11);

        // 12
        Question q12 = new Question(
            "DYNAMIC GAIT",
            "12. Walk with Pivot Turns",
            "Walk at normal speed. On command, turn as quickly as possible, face the opposite direction, stop, and keep feet close together."
        );
        q12.answers.Add(new Answer(0, "Severe: Cannot turn with feet close at any speed without imbalance."));
        q12.answers.Add(new Answer(1, "Moderate: Turns with feet close slowly, taking more than 4 steps, with good balance."));
        q12.answers.Add(new Answer(2, "Normal: Turns quickly with feet close, fewer than 3 steps, with good balance."));
        questions.Add(q12);

        // 13
        Question q13 = new Question(
            "DYNAMIC GAIT",
            "13. Step Over Obstacles",
            "Walk at normal speed. At the box, step over it rather than around it, then continue walking."
        );
        q13.answers.Add(new Answer(0, "Severe: Unable to step over the box or steps around it."));
        q13.answers.Add(new Answer(1, "Moderate: Steps over the box but touches it, or slows gait cautiously."));
        q13.answers.Add(new Answer(2, "Normal: Steps over the box with minimal gait-speed change and good balance."));
        questions.Add(q13);

        // 14
        Question q14 = new Question(
            "DYNAMIC GAIT",
            "14. Timed Up and Go with Dual Task",
            "Perform a 3-meter Timed Up and Go while counting backward by threes. Compare performance with the standard Timed Up and Go."
        );
        q14.answers.Add(new Answer(0, "Severe: Stops counting while walking, or stops walking while counting."));
        q14.answers.Add(new Answer(1, "Moderate: Dual task affects counting or walking by more than 10 percent compared with normal Timed Up and Go."));
        q14.answers.Add(new Answer(2, "Normal: No noticeable change in sitting, standing, or walking while counting backward."));
        questions.Add(q14);
    }

    private void ShowQuestion()
    {
        Question question = questions[currentQuestionIndex];

        if (sectionText != null)
            sectionText.text = question.section;

        if (titleText != null)
            titleText.text = question.title;

        if (instructionText != null)
            instructionText.text = question.instruction;

        if (progressText != null)
            progressText.text = "Item " + (currentQuestionIndex + 1) + " / " + questions.Count;

        UpdateQuestionImage(question.image);
        CreateAnswerOptions(question);
        UpdateButtons();
        UpdateRunningTotal();
    }

    private void UpdateQuestionImage(Sprite imageToShow)
    {
        if (questionImage == null)
            return;

        questionImage.sprite = imageToShow;
        questionImage.preserveAspect = true;
        questionImage.gameObject.SetActive(imageToShow != null);
    }

    private void CreateAnswerOptions(Question question)
    {
        // Remove old answers
        for (int i = answersPanel.childCount - 1; i >= 0; i--)
        {
            Destroy(answersPanel.GetChild(i).gameObject);
        }

        // Clear any previous selection in the group
        toggleGroup.SetAllTogglesOff();

        // Store the toggles so we can restore selection AFTER all are created
        List<Toggle> createdToggles = new List<Toggle>();
        int savedScore = selectedScores[currentQuestionIndex];

        for (int i = 0; i < question.answers.Count; i++)
        {
            Answer answer = question.answers[i];

            GameObject answerObject = Instantiate(answerPrefab, answersPanel);

            Toggle toggle = answerObject.GetComponentInChildren<Toggle>();
            Text answerText = answerObject.GetComponentInChildren<Text>();

            if (toggle == null)
            {
                Debug.LogError("Answer Prefab must contain a Toggle.");
                Destroy(answerObject);
                continue;
            }

            // Important: turn it OFF before assigning it to the group
            toggle.group = null;
            toggle.SetIsOnWithoutNotify(false);

            if (answerText != null)
            {
                answerText.text = answer.score + " - " + answer.text;
            }

            toggle.group = toggleGroup;

            int scoreToSave = answer.score;

            toggle.onValueChanged.AddListener(isOn =>
            {
                if (isOn)
                {
                    selectedScores[currentQuestionIndex] = scoreToSave;
                    UpdateRunningTotal();
                }
            });

            createdToggles.Add(toggle);
        }

        // Restore only the score selected earlier for this question.
        // If savedScore is -1, nothing will be selected.
        if (savedScore != -1)
        {
            for (int i = 0; i < question.answers.Count; i++)
            {
                if (question.answers[i].score == savedScore)
                {
                    createdToggles[i].SetIsOnWithoutNotify(true);
                    break;
                }
            }
        }
    }
    private void UpdateButtons()
    {
        bool isFirstQuestion = currentQuestionIndex == 0;
        bool isLastQuestion = currentQuestionIndex == questions.Count - 1;

        backButton.gameObject.SetActive(!isFirstQuestion);
        nextButton.gameObject.SetActive(!isLastQuestion);
        submitButton.gameObject.SetActive(isLastQuestion);
    }

    public void NextQuestion()
    {
        if (currentQuestionIndex < questions.Count - 1)
        {
            currentQuestionIndex++;
            ShowQuestion();
        }
    }

    public void PreviousQuestion()
    {
        if (currentQuestionIndex > 0)
        {
            currentQuestionIndex--;
            ShowQuestion();
        }
    }

    private void UpdateRunningTotal()
    {
        int total = 0;
        int completed = 0;

        for (int i = 0; i < selectedScores.Count; i++)
        {
            if (selectedScores[i] >= 0)
            {
                total += selectedScores[i];
                completed++;
            }
        }

        if (totalText != null)
        {
            totalText.text = "Score: " + total + " / 28\nCompleted: " + completed + " / 14";
        }
    }

    public void SubmitAssessment()
    {
        int total = 0;
        int unanswered = 0;

        for (int i = 0; i < selectedScores.Count; i++)
        {
            if (selectedScores[i] == -1)
                unanswered++;
            else
                total += selectedScores[i];
        }

        Debug.Log("Mini-BESTest completed. Score: " + total + " / 28");
        Debug.Log("Unanswered items: " + unanswered);

        if (finalScoreText != null)
        {
            finalScoreText.text =
                "Mini-BESTest Complete\n\n" +
                "Final Score: " + total + " / 28\n" +
                "Unanswered: " + unanswered;
        }

        if (resultPanel != null)
        {
            resultPanel.SetActive(true);
        }
    }
}