import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <Link className="brand" to={user ? "/dashboard" : "/"}>
        Quiz Platform
      </Link>

      <nav className="nav-actions">
        {user ? (
          <>
            <span className="nav-user">
              {user.name} ({user.role})
            </span>
            <Link to="/dashboard" className="secondary-button">
              Dashboard
            </Link>
            <button type="button" className="danger-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="secondary-button">
              Login
            </Link>
            <Link to="/register" className="primary-button">
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
