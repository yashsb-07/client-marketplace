import { useState } from "react";
import {
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "../context/useAuth";

function RegisterPage() {
  const {
    register,
    isAuthenticated,
    user,
  } = useAuth();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      navigate("/buyer", {
        replace: true,
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create your account. Please try again."
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

          <h1>Create your account</h1>

          <p>
            Create a buyer account to continue.
          </p>
        </div>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          <div className="auth-field">
            <label htmlFor="register-name">
              Full name
            </label>

            <input
              id="register-name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
              autoComplete="name"
              minLength={2}
              maxLength={100}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="register-email">
              Email
            </label>

            <input
              id="register-email"
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
            <label htmlFor="register-password">
              Password
            </label>

            <input
              id="register-password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              autoComplete="new-password"
              minLength={6}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="register-confirm-password">
              Confirm password
            </label>

            <input
              id="register-confirm-password"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Enter your password again"
              autoComplete="new-password"
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
              ? "Creating account..."
              : "Create Buyer Account"}
          </button>
        </form>

        <p className="auth-card__footer">
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>
      </section>
    </main>
  );
}

export default RegisterPage;