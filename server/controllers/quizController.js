const mongoose = require("mongoose");
const Quiz = require("../models/Quiz");
const Question = require("../models/Question");
const Result = require("../models/Result");

const getQuestionsCountMap = async (quizIds) => {
  if (quizIds.length === 0) {
    return {};
  }

  const counts = await Question.aggregate([
    { $match: { quizId: { $in: quizIds.map((id) => new mongoose.Types.ObjectId(id)) } } },
    { $group: { _id: "$quizId", totalQuestions: { $sum: 1 } } },
  ]);

  return counts.reduce((map, item) => {
    map[item._id.toString()] = item.totalQuestions;
    return map;
  }, {});
};

const createQuiz = async (req, res, next) => {
  try {
    const { title, description, timeLimit } = req.body;

    if (!title || !timeLimit) {
      return res.status(400).json({ message: "Title and time limit are required." });
    }

    const quiz = await Quiz.create({
      title,
      description,
      timeLimit,
      createdBy: req.user._id,
    });

    res.status(201).json({ message: "Quiz created successfully.", quiz });
  } catch (error) {
    next(error);
  }
};

const getQuizzes = async (req, res, next) => {
  try {
    const filter = req.user.role === "teacher" ? { createdBy: req.user._id } : {};
    const quizzes = await Quiz.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    const questionCountMap = await getQuestionsCountMap(quizzes.map((quiz) => quiz._id.toString()));
    const data = quizzes.map((quiz) => ({
      ...quiz.toObject(),
      totalQuestions: questionCountMap[quiz._id.toString()] || 0,
    }));

    res.json(data);
  } catch (error) {
    next(error);
  }
};

const getQuizById = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate("createdBy", "name email");

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found." });
    }

    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Only teachers can access full quiz details." });
    }

    if (quiz.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only view your own quizzes." });
    }

    const questions = await Question.find({ quizId: quiz._id }).sort({ createdAt: 1 });

    res.json({
      ...quiz.toObject(),
      questions,
    });
  } catch (error) {
    next(error);
  }
};

const updateQuiz = async (req, res, next) => {
  try {
    const { title, description, timeLimit } = req.body;
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found." });
    }

    if (quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only update your own quizzes." });
    }

    quiz.title = title || quiz.title;
    quiz.description = description !== undefined ? description : quiz.description;
    quiz.timeLimit = timeLimit || quiz.timeLimit;

    await quiz.save();

    res.json({ message: "Quiz updated successfully.", quiz });
  } catch (error) {
    next(error);
  }
};

const deleteQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found." });
    }

    if (quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only delete your own quizzes." });
    }

    await Question.deleteMany({ quizId: quiz._id });
    await Result.deleteMany({ quizId: quiz._id });
    await quiz.deleteOne();

    res.json({ message: "Quiz deleted successfully." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createQuiz,
  getQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
};
