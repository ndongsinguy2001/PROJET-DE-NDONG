import { useState } from "react";
import { createClass, updateClass } from "../../services/classService";
import toast from "react-hot-toast";

const AddEditClassModal = ({ classData, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: classData?.name || "",
    level: classData?.level || "CM1",
    capacity: classData?.capacity || "",
    academicYear: classData?.academicYear || "2024-2025",
    room: classData?.room || "",
    status: classData?.status || "Active",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (classData) {
        await updateClass(classData._id, formData);
        toast.success("Classe modifiée avec succès");
      } else {
        await createClass(formData);
        toast.success("Classe ajoutée avec succès");
      }
      onSuccess();
    } catch {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">
          {classData ? "Modifier la classe" : "Ajouter une classe"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Nom de la classe"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />

          <select
            name="level"
            value={formData.level}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option>CI</option>
            <option>CP</option>
            <option>CE1</option>
            <option>CE2</option>
            <option>CM1</option>
            <option>CM2</option>
            <option>6ème</option>
            <option>5ème</option>
            <option>4ème</option>
            <option>3ème</option>
            <option>2nde</option>
            <option>1ère</option>
            <option>Terminale</option>
          </select>

          <input
            type="number"
            name="capacity"
            placeholder="Capacité"
            value={formData.capacity}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />

          <input
            name="academicYear"
            placeholder="Année académique"
            value={formData.academicYear}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <input
            name="room"
            placeholder="Salle"
            value={formData.room}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditClassModal;