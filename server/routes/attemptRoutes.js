const express = require("express");
const { startAttempt, submitAttempt } = require("../controllers/attemptController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, authorize("student"));

router.get("/:quizId/start", startAttempt);
router.post("/:quizId/submit", submitAttempt);

module.exports = router;
