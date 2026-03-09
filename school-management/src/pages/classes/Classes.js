import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getClasses, deleteClass } from "../../services/classService";
import AddEditClassModal from "./AddEditClassModal";
import { getCurrentUser } from "../../services/authService";
import toast from "react-hot-toast";

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const navigate = useNavigate();
  const user = getCurrentUser();

  const fetchClasses = async () => {
    const res = await getClasses();
    setClasses(res.data.data || []);
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette classe ?")) return;
    try {
      await deleteClass(id);
      toast.success("Classe supprimée");
      fetchClasses();
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Classes</h1>
        {user?.role === "Admin" && (
          <button
            onClick={() => {
              setSelectedClass(null);
              setShowModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Ajouter une classe
          </button>
        )}
      </div>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Nom</th>
            <th className="p-2">Niveau</th>
            <th className="p-2">Capacité</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((c) => (
            <tr key={c._id} className="border-t">
              <td className="p-2">{c.name}</td>
              <td className="p-2">{c.level}</td>
              <td className="p-2">{c.capacity}</td>
              <td className="p-2 flex gap-3">
                <button
                  onClick={() => navigate(`/classes/${c._id}`)}
                  className="text-blue-600"
                >
                  Voir
                </button>
                {user?.role === "Admin" && (
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="text-red-600"
                  >
                    Supprimer
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <AddEditClassModal
          classData={selectedClass}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchClasses();
          }}
        />
      )}
    </div>
  );
};

export default Classes;