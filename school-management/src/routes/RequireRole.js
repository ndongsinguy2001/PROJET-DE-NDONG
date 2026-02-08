import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../services/authService";

const RequireRole = ({ allowedRoles, children }) => {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold text-red-600">
          Accès refusé
        </h2>
        <p className="text-gray-600 mt-2">
          Vous n’avez pas les permissions nécessaires.
        </p>
      </div>
    );
  }

  return children;
};

export default RequireRole;
