import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
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
      await register(formData);
      navigate("/dashboard");
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-layout">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Register</h1>
        <p className="muted-text">Create a student or teacher account.</p>

        {error ? <div className="error-box">{error}</div> : null}

        <label>
          Full Name
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </label>

        <label>
          Email
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label>

        <label>
          Password
          <input type="password" name="password" value={formData.password} onChange={handleChange} minLength="6" required />
        </label>

        <label>
          Role
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </label>

        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="muted-text">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </section>
  );
}

export default RegisterPage;
