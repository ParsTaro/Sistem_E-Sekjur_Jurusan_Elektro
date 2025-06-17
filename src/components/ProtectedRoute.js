import React from "react";
import { Navigate } from "react-router-dom";
import { getToken, getUserFromToken } from "../utils/auth";

function ProtectedRoute({ children, allowedRoles }) {
  const token = getToken();
  const user = getUserFromToken();

  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}

export default ProtectedRoute;
