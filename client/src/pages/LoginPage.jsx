import { useState } from "react";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "../context/useAuth";

function LoginPage() {
  const {
    login,
    isAuthenticated,
    user,
  } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    if (user.role === "BUYER") {
      return (
        <Navigate
          to="/buyer"
          replace
        />
      );
    }

    return (
      <Navigate
        to="/marketplace"
        replace
      />
    );
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      await login(form);

      const destination =
        location.state?.from?.pathname || "/buyer";

      navigate(destination, {
        replace: true,
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to login. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-card__header">
          <p className="auth-card__eyebrow">
            Buyer Account
          </p>

          <h1>Welcome back</h1>

          <p>
            Login to continue to your marketplace
            account.
          </p>
        </div>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          <div className="auth-field">
            <label htmlFor="login-email">
              Email
            </label>

            <input
              id="login-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="login-password">
              Password
            </label>

            <input
              id="login-password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p
              className="auth-form__error"
              role="alert"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="auth-form__submit"
            disabled={submitting}
          >
            {submitting
              ? "Logging in..."
              : "Login"}
          </button>
        </form>

        <p className="auth-card__footer">
          Don't have an account?{" "}
          <Link to="/register">
            Create one
          </Link>
        </p>
      </section>
    </main>
  );
}

export default LoginPage;