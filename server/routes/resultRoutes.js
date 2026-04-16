const express = require("express");
const { getMyResults, getMyQuizResult, getQuizResultsForTeacher } = require("../controllers/resultController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/me", getMyResults);
router.get("/quiz/:quizId/me", getMyQuizResult);
router.get("/quiz/:quizId", getQuizResultsForTeacher);

module.exports = router;
