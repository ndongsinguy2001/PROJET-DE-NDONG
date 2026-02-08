import { useEffect, useState } from "react";
import api from "../../api/axios";

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const role = localStorage.getItem("role");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await api.get("/dashboard/stats");
        setStats(res.data.data);
      } catch (error) {
        console.error("Erreur dashboard", error);
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {(role === "Admin" || role === "Enseignant") && (
          <StatCard
            title="Élèves"
            value={stats.totalStudents || 0}
            color="bg-blue-100 text-blue-700"
          />
        )}

        {role === "Admin" && (
          <StatCard
            title="Enseignants"
            value={stats.totalTeachers || 0}
            color="bg-purple-100 text-purple-700"
          />
        )}

        {role === "Admin" && (
          <StatCard
            title="Classes"
            value={stats.totalClasses || 0}
            color="bg-yellow-100 text-yellow-700"
          />
        )}

        {(role === "Admin" || role === "Comptable") && (
          <StatCard
            title="Revenus"
            value={`${(stats.totalRevenue || 0).toLocaleString()} FCFA`}
            color="bg-green-100 text-green-700"
          />
        )}

        {role === "Enseignant" && (
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
