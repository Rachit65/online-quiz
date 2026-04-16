import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

function ResultPage() {
  const { quizId } = useParams();
  const { user } = useAuth();
  const location = useLocation();
  const [teacherView, setTeacherView] = useState(null);
  const [studentView, setStudentView] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResultData = async () => {
      setLoading(true);
      setError("");

      try {
        if (user.role === "teacher") {
          const { data } = await axiosInstance.get(`/results/quiz/${quizId}`);
          setTeacherView(data);
        } else {
          const { data } = await axiosInstance.get(`/results/quiz/${quizId}/me`);
          setStudentView(data);
        }
      } catch (apiError) {
        setError(apiError.response?.data?.message || "Failed to load result data.");
      } finally {
        setLoading(false);
      }
    };

    fetchResultData();
  }, [quizId, user.role]);

  if (loading) {
    return <div className="info-card">Loading results...</div>;
  }

  if (error) {
    return (
      <section className="section-stack">
        <div className="error-box">{error}</div>
        <Link to="/dashboard" className="secondary-button">
          Back to Dashboard
        </Link>
      </section>
    );
  }

  if (user.role === "teacher") {
    return (
      <section className="section-stack">
        <div className="section-heading">
          <div>
            <h1>{teacherView.quiz.title} - Student Results</h1>
            <p className="muted-text">Review student scores for this quiz.</p>
          </div>
          <Link to="/dashboard" className="secondary-button">
            Back to Dashboard
          </Link>
        </div>

        <div className="table-card">
          {teacherView.results.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Email</th>
                  <th>Score</th>
                  <th>Submitted At</th>
                </tr>
              </thead>
              <tbody>
                {teacherView.results.map((result) => (
                  <tr key={result._id}>
                    <td>{result.userId?.name}</td>
                    <td>{result.userId?.email}</td>
                    <td>
                      {result.score} / {result.totalQuestions}
                    </td>
                    <td>{new Date(result.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="info-card">No students have submitted this quiz yet.</div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="section-stack">
      {location.state?.message ? <div className="success-box">{location.state.message}</div> : null}

      <div className="hero-card">
        <div>
          <h1>{studentView.quizId?.title} - Your Result</h1>
          <p className="muted-text">Your answers have been auto-evaluated.</p>
        </div>
        <div className="score-box">
          Score: {studentView.score} / {studentView.totalQuestions}
        </div>
      </div>

      <div className="card">
        <h3>Submission Summary</h3>
        <p>Total Questions: {studentView.totalQuestions}</p>
        <p>Correct Answers: {studentView.score}</p>
        <p>Incorrect / Unanswered: {studentView.totalQuestions - studentView.score}</p>
        <p>Submitted On: {new Date(studentView.createdAt).toLocaleString()}</p>
      </div>

      <Link to="/dashboard" className="secondary-button">
        Back to Dashboard
      </Link>
    </section>
  );
}

export default ResultPage;
