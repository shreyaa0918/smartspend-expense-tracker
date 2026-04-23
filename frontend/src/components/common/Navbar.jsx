import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../features/auth/authSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <header className="navbar">
      <div className="navbar__brand">SmartSpend</div>
      <div className="navbar__actions">
        <span className="navbar__user">
          {user?.name ? `Hi, ${user.name}` : "Logged in"}
        </span>
        <button className="btn btn--ghost" onClick={onLogout} type="button">
          Logout
        </button>
      </div>
    </header>
  );
}
