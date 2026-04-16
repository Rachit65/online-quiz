const Quiz = require("../models/Quiz");
const Question = require("../models/Question");
const Result = require("../models/Result");

const startAttempt = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId).populate("createdBy", "name");

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found." });
    }

    const existingResult = await Result.findOne({
      userId: req.user._id,
      quizId: quiz._id,
    });

    if (existingResult) {
      return res.status(400).json({ message: "You have already submitted this quiz." });
    }

    const questions = await Question.find({ quizId: quiz._id }).sort({ createdAt: 1 });

    if (questions.length === 0) {
      return res.status(400).json({ message: "This quiz has no questions yet." });
    }

    const safeQuestions = questions.map((question) => ({
      _id: question._id,
      questionText: question.questionText,
      options: question.options,
    }));

    res.json({
      _id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      timeLimit: quiz.timeLimit,
      createdBy: quiz.createdBy,
      questions: safeQuestions,
    });
  } catch (error) {
    next(error);
  }
};

const submitAttempt = async (req, res, next) => {
  try {
    const { answers } = req.body;
    const quiz = await Quiz.findById(req.params.quizId);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found." });
    }

    const alreadySubmitted = await Result.findOne({
      userId: req.user._id,
      quizId: quiz._id,
    });

    if (alreadySubmitted) {
      return res.status(400).json({ message: "You have already submitted this quiz." });
    }

    const questions = await Question.find({ quizId: quiz._id }).sort({ createdAt: 1 });
    if (questions.length === 0) {
      return res.status(400).json({ message: "This quiz has no questions to evaluate." });
    }

    const submittedAnswers = Array.isArray(answers) ? answers : [];

    let score = 0;
    const evaluatedAnswers = questions.map((question) => {
      const userAnswer = submittedAnswers.find(
        (item) => item.questionId === question._id.toString() || item.questionId === question._id
      );
      const selectedOption = typeof userAnswer?.selectedOption === "number" ? userAnswer.selectedOption : null;
      const isCorrect = selectedOption === question.correctAnswer;

      if (isCorrect) {
        score += 1;
      }

      return {
        questionId: question._id,
        selectedOption,
        isCorrect,
      };
    });

    const result = await Result.create({
      userId: req.user._id,
      quizId: quiz._id,
      score,
      totalQuestions: questions.length,
      answers: evaluatedAnswers,
    });

    res.status(201).json({
      message: "Quiz submitted successfully.",
      result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  startAttempt,
  submitAttempt,
};
