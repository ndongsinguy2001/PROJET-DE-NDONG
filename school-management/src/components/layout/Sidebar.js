import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const role = localStorage.getItem("role");

  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded ${
      isActive ? "bg-blue-600 text-white" : "hover:bg-gray-200"
    }`;

  return (
    <aside className="w-64 bg-white shadow-lg p-4">
      <h2 className="text-xl font-bold mb-6">Gestion Scolaire</h2>

      <nav className="space-y-2">
        <NavLink to="/dashboard" className={linkClass}>
          Dashboard
        </NavLink>

        {(role === "Admin" || role === "Enseignant") && (
          <NavLink to="/students" className={linkClass}>
            Élèves
          </NavLink>
        )}

        {role === "Admin" && (
          <NavLink to="/classes" className={linkClass}>
            Classes
          </NavLink>
        )}

        {role === "Admin" && (
          <NavLink to="/teachers" className={linkClass}>
            Enseignants
          </NavLink>
        )}

        {(role === "Admin" || role === "Enseignant") && (
          <NavLink to="/grades" className={linkClass}>
            Notes
          </NavLink>
        )}

        {(role === "Admin" || role === "Comptable") && (
          <NavLink to="/payments" className={linkClass}>
            Paiements
          </NavLink>
        )}

        {(role === "Admin" || role === "Enseignant") && (
          <NavLink to="/attendance" className={linkClass}>
            Présences
          </NavLink>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
