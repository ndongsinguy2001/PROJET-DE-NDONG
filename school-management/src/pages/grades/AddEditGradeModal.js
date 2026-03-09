import { useState } from "react";
import { createGrade } from "../../services/gradeService";
import toast from "react-hot-toast";

const AddEditGradeModal = ({ students, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    student: "",
    subject: "",
    examType: "",
    score: "",
    term: "",
    class: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createGrade(formData);
      toast.success("Note ajoutée avec succès");
      onSuccess();
    } catch {
      toast.error("Erreur lors de l'ajout de la note");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg w-full max-w-lg space-y-4"
      >
        <h2 className="text-xl font-bold text-center">Ajouter une note</h2>

        <select name="student" required className="border p-2 rounded w-full" onChange={handleChange}>
          <option value="">Élève</option>
          {students.map((s) => (
            <option key={s._id} value={s._id}>
              {s.firstName} {s.lastName}
            </option>
          ))}
        </select>

        <input name="subject" placeholder="Matière" className="border p-2 rounded w-full" required onChange={handleChange} />

        <select name="examType" className="border p-2 rounded w-full" required onChange={handleChange}>
          <option value="">Type</option>
          <option>Devoir</option>
          <option>Composition 1</option>
          <option>Composition 2</option>
          <option>Examen final</option>
        </select>

        <input name="score" type="number" max="20" className="border p-2 rounded w-full" required onChange={handleChange} />

        <select name="term" className="border p-2 rounded w-full" required onChange={handleChange}>
          <option value="">Trimestre</option>
          <option>Trimestre 1</option>
          <option>Trimestre 2</option>
          <option>Trimestre 3</option>
        </select>

        <input name="class" placeholder="Classe" className="border p-2 rounded w-full" required onChange={handleChange} />

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditGradeModal;