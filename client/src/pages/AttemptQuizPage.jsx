import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

function AttemptQuizPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadQuiz = async () => {
    setLoading(true);

    try {
      const { data } = await axiosInstance.get(`/attempts/${quizId}/start`);
      setQuiz(data);
      setSecondsRemaining(data.timeLimit * 60);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Failed to start quiz.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuiz();
  }, [quizId]);

  useEffect(() => {
    if (!quiz || secondsRemaining <= 0 || submitting) {
      return undefined;
    }

    const timer = setInterval(() => {
      setSecondsRemaining((current) => current - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [quiz, secondsRemaining, submitting]);

  useEffect(() => {
    if (quiz && secondsRemaining === 0 && !submitting) {
      handleSubmit(true);
    }
  }, [secondsRemaining, quiz, submitting]);

  const handleAnswerChange = (questionId, selectedOption) => {
    setAnswers((current) => ({
      ...current,
      [questionId]: selectedOption,
    }));
  };

  const handleSubmit = async (autoSubmitted = false) => {
    if (submitting) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, selectedOption]) => ({
        questionId,
        selectedOption,
      }));

      await axiosInstance.post(`/attempts/${quizId}/submit`, { answers: formattedAnswers });
      navigate(`/results/${quizId}`, {
        state: {
          message: autoSubmitted ? "Time is over. Your quiz was auto-submitted." : "Quiz submitted successfully.",
        },
      });
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Failed to submit quiz.");
      setSubmitting(false);
    }
  };

  const formatTime = () => {
    const minutes = Math.floor(secondsRemaining / 60);
    const seconds = secondsRemaining % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  if (loading) {
    return <div className="info-card">Loading quiz...</div>;
  }

  if (error && !quiz) {
    return <div className="error-box">{error}</div>;
  }

  return (
    <section className="section-stack">
      <div className="hero-card">
        <div>
          <h1>{quiz.title}</h1>
          <p className="muted-text">{quiz.description || "Read each question carefully and choose the best answer."}</p>
        </div>
        <div className="timer-box">Time Left: {formatTime()}</div>
      </div>

      {error ? <div className="error-box">{error}</div> : null}

      <div className="section-stack">
        {quiz.questions.map((question, index) => (
          <article className="card" key={question._id}>
            <h3>
              {index + 1}. {question.questionText}
            </h3>

            <div className="option-group">
              {question.options.map((option, optionIndex) => (
                <label className="option-item" key={optionIndex}>
                  <input
                    type="radio"
                    name={question._id}
                    checked={answers[question._id] === optionIndex}
                    onChange={() => handleAnswerChange(question._id, optionIndex)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </article>
        ))}
      </div>

      <button type="button" className="primary-button" onClick={() => handleSubmit(false)} disabled={submitting}>
        {submitting ? "Submitting..." : "Submit Quiz"}
      </button>
    </section>
  );
}

export default AttemptQuizPage;
