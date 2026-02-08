import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, roles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  //  Pas connecté
  if (!token || !role) {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  //  Rôle non autorisé
  if (roles && !roles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  //  Autorisé
  return children;
};

export default ProtectedRoute;

