const Quiz = require("../models/Quiz");
const Result = require("../models/Result");

const getMyResults = async (req, res, next) => {
  try {
    const results = await Result.find({ userId: req.user._id })
      .populate("quizId", "title timeLimit")
      .sort({ createdAt: -1 });

    res.json(results);
  } catch (error) {
    next(error);
  }
};

const getMyQuizResult = async (req, res, next) => {
  try {
    const result = await Result.findOne({
      userId: req.user._id,
      quizId: req.params.quizId,
    }).populate("quizId", "title timeLimit");

    if (!result) {
      return res.status(404).json({ message: "Result not found for this quiz." });
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getQuizResultsForTeacher = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found." });
    }

    if (quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only view results for your own quizzes." });
    }

    const results = await Result.find({ quizId: quiz._id })
      .populate("userId", "name email")
      .sort({ score: -1, createdAt: -1 });

    res.json({
      quiz,
      results,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyResults,
  getMyQuizResult,
  getQuizResultsForTeacher,
};
