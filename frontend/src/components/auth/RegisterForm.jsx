import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthError } from "../../features/auth/authSlice";
import { registerUser } from "../../features/auth/authThunks";

export default function RegisterForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

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
    const resultAction = await dispatch(registerUser(formData));
    if (registerUser.fulfilled.match(resultAction)) {
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="auth-card">
      <h1 className="auth-card__title">Create account</h1>
      <p className="auth-card__subtitle">Start tracking your finances with SmartSpend.</p>

      <form onSubmit={onSubmit} className="auth-form">
        <label className="auth-form__label" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={onChange}
          required
          minLength={2}
          placeholder="Your full name"
          className="auth-form__input"
        />

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
          placeholder="At least 6 characters"
          className="auth-form__input"
        />

        {error ? <p className="auth-form__error">{error}</p> : null}

        <button className="btn btn--primary auth-form__submit" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Register"}
        </button>
      </form>

      <p className="auth-card__footer">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
}
