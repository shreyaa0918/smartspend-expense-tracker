import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthError } from "../../features/auth/authSlice";
import { loginUser } from "../../features/auth/authThunks";

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({ email: "", password: "" });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const onChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    await dispatch(loginUser(formData));
  };

  return (
    <div className="auth-card">
      <h1 className="auth-card__title">Welcome back</h1>
      <p className="auth-card__subtitle">Login to continue managing your expenses.</p>

      <form onSubmit={onSubmit} className="auth-form">
        <label className="auth-form__label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={onChange}
          required
          placeholder="you@example.com"
          className="auth-form__input"
        />

        <label className="auth-form__label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={onChange}
          required
          minLength={6}
          placeholder="Enter password"
          className="auth-form__input"
        />

        {error ? <p className="auth-form__error">{error}</p> : null}

        <button className="btn btn--primary auth-form__submit" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>

      <p className="auth-card__footer">
        New here? <Link to="/register">Create account</Link>
      </p>
    </div>
  );
}
