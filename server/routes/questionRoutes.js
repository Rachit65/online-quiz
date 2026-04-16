const express = require("express");
const { addQuestion, updateQuestion, deleteQuestion } = require("../controllers/questionController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, authorize("teacher"));

router.post("/:quizId", addQuestion);
router.put("/:questionId", updateQuestion);
router.delete("/:questionId", deleteQuestion);

module.exports = router;
