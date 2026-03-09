import { useEffect, useState } from "react";
import api from "../../api/axios";
import { getCurrentUser } from "../../services/authService";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const user = getCurrentUser();

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await api.get("/dashboard/stats");
        setStats(res.data.data);
      } catch (error) {
        toast.error("Erreur chargement du tableau de bord");
      }
    };
    loadDashboard();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {(user?.role === "Admin" || user?.role === "Enseignant") && (
          <StatCard
            title="Élèves"
            value={stats.totalStudents || 0}
            color="bg-blue-100 text-blue-700"
          />
        )}

        {user?.role === "Admin" && (
          <StatCard
            title="Enseignants"
            value={stats.totalTeachers || 0}
            color="bg-purple-100 text-purple-700"
          />
        )}

        {user?.role === "Admin" && (
          <StatCard
            title="Classes"
            value={stats.totalClasses || 0}
            color="bg-yellow-100 text-yellow-700"
          />
        )}

        {(user?.role === "Admin" || user?.role === "Comptable") && (
          <StatCard
            title="Revenus"
            value={`${(stats.totalRevenue || 0).toLocaleString()} FCFA`}
            color="bg-green-100 text-green-700"
          />
        )}

        {user?.role === "Enseignant" && (
          <StatCard
            title="Présences aujourd’hui"
            value={stats.attendanceToday || 0}
            color="bg-green-100 text-green-700"
          />
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color }) => (
  <div className={`p-6 rounded shadow ${color}`}>
    <h2 className="text-sm font-semibold">{title}</h2>
    <p className="text-2xl font-bold mt-2">{value}</p>
  </div>
);

export default Dashboard;