import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children }) {
  const { token, isAuthenticated } = useSelector((state) => state.auth);
  if (!token || !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
