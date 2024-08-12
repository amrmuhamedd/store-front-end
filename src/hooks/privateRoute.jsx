import React, { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const PrivateRoute = ({ element: Component, roles = [] }) => {
  const isAuthenticated = localStorage.getItem("token") !== null;
  const user = JSON.parse(localStorage.getItem("user"));
  const hasRequiredRole =
    roles.length === 0 || (user && roles.includes(user.role));
  console.log({ isAuthenticated, user });
  return isAuthenticated && hasRequiredRole ? (
    Component
  ) : isAuthenticated && !hasRequiredRole ? (
    <Navigate to="/" />
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
