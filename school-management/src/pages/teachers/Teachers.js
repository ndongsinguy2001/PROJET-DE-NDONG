import { useEffect, useState } from "react";
import {
  getTeachers,
  deleteTeacher,
} from "../../services/teacherService";
import AddEditTeacherModal from "./AddEditTeacherModal";

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchTeachers = async () => {
    const res = await getTeachers();
    setTeachers(res.data.data || []);
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet enseignant ?")) return;
    await deleteTeacher(id);
    fetchTeachers();
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Enseignants</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Ajouter un enseignant
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Nom</th>
              <th className="p-3">Email</th>
              <th className="p-3">Téléphone</th>
              <th className="p-3">Matière</th>
              <th className="p-3">Statut</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((t) => (
              <tr key={t._id} className="border-t">
                <td className="p-3">
                  {t.lastName} {t.firstName}
                </td>
                <td className="p-3">{t.email}</td>
                <td className="p-3">{t.phone || "-"}</td>
                <td className="p-3">{t.subject || "-"}</td>
                <td className="p-3">{t.status}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleDelete(t._id)}
                    className="text-red-600 hover:underline"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}

            {teachers.length === 0 && (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
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
