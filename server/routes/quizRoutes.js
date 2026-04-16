const express = require("express");
const {
  createQuiz,
  getQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
} = require("../controllers/quizController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.route("/").get(getQuizzes).post(authorize("teacher"), createQuiz);
router.route("/:id").get(getQuizById).put(authorize("teacher"), updateQuiz).delete(authorize("teacher"), deleteQuiz);

module.exports = router;
