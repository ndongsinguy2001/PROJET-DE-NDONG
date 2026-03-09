import { useEffect, useState } from "react";
import { getTeachers, deleteTeacher } from "../../services/teacherService";
import AddEditTeacherModal from "./AddEditTeacherModal";
import { getCurrentUser } from "../../services/authService";
import toast from "react-hot-toast";

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const user = getCurrentUser();

  const fetchTeachers = async () => {
    const res = await getTeachers();
    setTeachers(res.data.data || []);
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet enseignant ?")) return;
    try {
      await deleteTeacher(id);
      toast.success("Enseignant supprimé");
      fetchTeachers();
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Enseignants</h1>
        {user?.role === "Admin" && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Ajouter un enseignant
          </button>
        )}
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Nom</th>
              <th className="p-3">Email</th>
              <th className="p-3">Téléphone</th>
              <th className="p-3">Matière</th>
              <th className="p-3">Statut</th>
              {user?.role === "Admin" && <th className="p-3">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {teachers.map((t) => (
              <tr key={t._id} className="border-t">
                <td className="p-3">{t.lastName} {t.firstName}</td>
                <td className="p-3">{t.email}</td>
                <td className="p-3">{t.phone || "-"}</td>
                <td className="p-3">{t.subject || "-"}</td>
                <td className="p-3">{t.status}</td>
                {user?.role === "Admin" && (
                  <td className="p-3">
                    <button
                      onClick={() => handleDelete(t._id)}
                      className="text-red-600 hover:underline"
                    >
                      Supprimer
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {teachers.length === 0 && (
              <tr>
                <td colSpan={user?.role === "Admin" ? 6 : 5} className="p-6 text-center text-gray-500">
                  Aucun enseignant trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <AddEditTeacherModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchTeachers();
          }}
        />
      )}
    </div>
  );
};

export default Teachers;