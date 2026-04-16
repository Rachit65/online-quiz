import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import AttemptQuizPage from "./pages/AttemptQuizPage";
import CreateQuizPage from "./pages/CreateQuizPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import RegisterPage from "./pages/RegisterPage";
import ResultPage from "./pages/ResultPage";

function App() {
  const { user } = useAuth();

  return (
    <div className="app-shell">
      <Navbar />
      <main className="page-container">
        <Routes>
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/quizzes/new"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <CreateQuizPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/quizzes/:quizId/edit"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <CreateQuizPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/quizzes/:quizId/attempt"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <AttemptQuizPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/results/:quizId"
            element={
              <ProtectedRoute>
                <ResultPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
