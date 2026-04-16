import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import QuestionEditor from "../components/QuestionEditor";

const initialQuizState = {
  title: "",
  description: "",
  timeLimit: 10,
};

function CreateQuizPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(quizId);
  const [quizForm, setQuizForm] = useState(initialQuizState);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [questionLoading, setQuestionLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadQuiz = async () => {
    if (!quizId) {
      return;
    }

    try {
      const { data } = await axiosInstance.get(`/quizzes/${quizId}`);
      setQuestions(data.questions || []);
      setQuizForm({
        title: data.title,
        description: data.description || "",
        timeLimit: data.timeLimit,
      });
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Failed to load quiz.");
    }
  };

  useEffect(() => {
    loadQuiz();
  }, [quizId]);

  const handleQuizChange = (event) => {
    setQuizForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleQuizSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      if (isEditMode) {
        await axiosInstance.put(`/quizzes/${quizId}`, {
          ...quizForm,
          timeLimit: Number(quizForm.timeLimit),
        });
        setSuccessMessage("Quiz updated successfully.");
      } else {
        const { data } = await axiosInstance.post("/quizzes", {
          ...quizForm,
          timeLimit: Number(quizForm.timeLimit),
        });
        navigate(`/teacher/quizzes/${data.quiz._id}/edit`);
      }
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Failed to save quiz.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionSubmit = async (questionData) => {
    setQuestionLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      await axiosInstance.post(`/questions/${quizId}`, questionData);
      await loadQuiz();
      setSuccessMessage("Question added successfully.");
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Failed to add question.");
    } finally {
      setQuestionLoading(false);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    const confirmed = window.confirm("Delete this question?");
    if (!confirmed) {
      return;
    }

    try {
      await axiosInstance.delete(`/questions/${questionId}`);
      await loadQuiz();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Failed to delete question.");
    }
  };

  return (
    <section className="section-stack">
      <div className="section-heading">
        <div>
          <h1>{isEditMode ? "Edit Quiz" : "Create Quiz"}</h1>
          <p className="muted-text">Teachers can create quizzes, add MCQ questions, and manage timing.</p>
        </div>
        <Link to="/dashboard" className="secondary-button">
          Back to Dashboard
        </Link>
      </div>

      {error ? <div className="error-box">{error}</div> : null}
      {successMessage ? <div className="success-box">{successMessage}</div> : null}

      <form className="card form-grid" onSubmit={handleQuizSubmit}>
        <label>
          Quiz Title
          <input type="text" name="title" value={quizForm.title} onChange={handleQuizChange} required />
        </label>

        <label>
          Description
          <textarea name="description" value={quizForm.description} onChange={handleQuizChange} rows="3" />
        </label>

        <label>
          Time Limit (minutes)
          <input type="number" min="1" name="timeLimit" value={quizForm.timeLimit} onChange={handleQuizChange} required />
        </label>

        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? "Saving..." : isEditMode ? "Update Quiz" : "Create Quiz"}
        </button>
      </form>

      {isEditMode ? (
        <>
          <QuestionEditor onSubmit={handleQuestionSubmit} loading={questionLoading} />

          <div className="section-heading">
            <h2>Quiz Questions</h2>
          </div>

          <div className="grid-layout">
            {questions.length > 0 ? (
              questions.map((question, index) => (
                <article className="card" key={question._id}>
                  <div className="card-header">
                    <h3>
                      Q{index + 1}. {question.questionText}
                    </h3>
                    <button type="button" className="danger-button" onClick={() => handleDeleteQuestion(question._id)}>
                      Delete
                    </button>
                  </div>

                  <ol className="option-list">
                    {question.options.map((option, optionIndex) => (
                      <li key={optionIndex} className={optionIndex === question.correctAnswer ? "correct-option" : ""}>
                        {option}
                      </li>
                    ))}
                  </ol>
                </article>
              ))
            ) : (
              <div className="info-card">Add at least one MCQ question to make the quiz useful.</div>
            )}
          </div>
        </>
      ) : (
        <div className="info-card">Create the quiz first. After that, this page will let you add MCQ questions.</div>
      )}
    </section>
  );
}

export default CreateQuizPage;
