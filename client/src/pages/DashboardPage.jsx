import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import QuizCard from "../components/QuizCard";
import { useAuth } from "../context/AuthContext";

function DashboardPage() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");

    try {
      const quizRequest = axiosInstance.get("/quizzes");
      const resultRequest = user.role === "student" ? axiosInstance.get("/results/me") : Promise.resolve({ data: [] });
      const [quizResponse, resultResponse] = await Promise.all([quizRequest, resultRequest]);

      setQuizzes(quizResponse.data);
      setResults(resultResponse.data);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteQuiz = async (quizId) => {
    const confirmed = window.confirm("Delete this quiz and all its questions/results?");
    if (!confirmed) {
      return;
    }

    try {
      await axiosInstance.delete(`/quizzes/${quizId}`);
      fetchDashboardData();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Failed to delete quiz.");
    }
  };

  if (loading) {
    return <div className="info-card">Loading dashboard...</div>;
  }

  return (
    <section className="section-stack">
      <div className="hero-card">
        <div>
          <h1>Welcome, {user.name}</h1>
          <p className="muted-text">
            {user.role === "teacher"
              ? "Create quizzes, add MCQs, and review student performance."
              : "Explore quizzes, attempt them with a timer, and review your scores."}
          </p>
        </div>

        {user.role === "teacher" ? (
          <Link className="primary-button" to="/teacher/quizzes/new">
            Create New Quiz
          </Link>
        ) : null}
      </div>

      {error ? <div className="error-box">{error}</div> : null}

      <div className="section-heading">
        <h2>{user.role === "teacher" ? "Your Quizzes" : "Available Quizzes"}</h2>
      </div>

      <div className="grid-layout">
        {quizzes.length > 0 ? (
          quizzes.map((quiz) => (
            <QuizCard
              key={quiz._id}
              quiz={quiz}
              actions={
                user.role === "teacher" ? (
                  <>
                    <Link className="primary-button" to={`/teacher/quizzes/${quiz._id}/edit`}>
                      Edit
                    </Link>
                    <Link className="secondary-button" to={`/results/${quiz._id}`}>
                      View Results
                    </Link>
                    <button type="button" className="danger-button" onClick={() => handleDeleteQuiz(quiz._id)}>
                      Delete
                    </button>
                  </>
                ) : (
                  <>
                    <Link className="primary-button" to={`/student/quizzes/${quiz._id}/attempt`}>
                      Attempt Quiz
                    </Link>
                    <Link className="secondary-button" to={`/results/${quiz._id}`}>
                      View Result
                    </Link>
                  </>
                )
              }
            />
          ))
        ) : (
          <div className="info-card">No quizzes found yet.</div>
        )}
      </div>

      {user.role === "student" ? (
        <>
          <div className="section-heading">
            <h2>Your Submitted Results</h2>
          </div>

          <div className="table-card">
            {results.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Quiz</th>
                    <th>Score</th>
                    <th>Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => (
                    <tr key={result._id}>
                      <td>{result.quizId?.title}</td>
                      <td>
                        {result.score} / {result.totalQuestions}
                      </td>
                      <td>{new Date(result.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="info-card">You have not submitted any quizzes yet.</div>
            )}
          </div>
        </>
      ) : null}
    </section>
  );
}

export default DashboardPage;
