import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(formData);
      navigate("/dashboard");
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-layout">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Login</h1>
        <p className="muted-text">Sign in to access your quiz dashboard.</p>

        {error ? <div className="error-box">{error}</div> : null}

        <label>
          Email
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label>

        <label>
          Password
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </label>

        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="muted-text">
          New user? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </section>
  );
}

export default LoginPage;
