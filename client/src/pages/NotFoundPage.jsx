import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <section className="info-card">
      <h1>404 - Page Not Found</h1>
      <p className="muted-text">The page you are looking for does not exist.</p>
      <Link className="primary-button" to="/dashboard">
        Go to Dashboard
      </Link>
    </section>
  );
}

export default NotFoundPage;
