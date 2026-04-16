const Quiz = require("../models/Quiz");
const Question = require("../models/Question");

const addQuestion = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const { questionText, options, correctAnswer } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found." });
    }

    if (quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only add questions to your own quizzes." });
    }

    const question = await Question.create({
      quizId,
      questionText,
      options,
      correctAnswer,
    });

    res.status(201).json({ message: "Question added successfully.", question });
  } catch (error) {
    next(error);
  }
};

const updateQuestion = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const { questionText, options, correctAnswer } = req.body;

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }

    const quiz = await Quiz.findById(question.quizId);
    if (!quiz || quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only update your own quiz questions." });
    }

    question.questionText = questionText || question.questionText;
    question.options = options || question.options;
    question.correctAnswer = correctAnswer ?? question.correctAnswer;

    await question.save();

    res.json({ message: "Question updated successfully.", question });
  } catch (error) {
    next(error);
  }
};

const deleteQuestion = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }

    const quiz = await Quiz.findById(question.quizId);
    if (!quiz || quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only delete your own quiz questions." });
    }

    await question.deleteOne();

    res.json({ message: "Question deleted successfully." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addQuestion,
  updateQuestion,
  deleteQuestion,
};
