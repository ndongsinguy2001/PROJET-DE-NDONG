import { useEffect, useState } from "react";
import { getStudents } from "../../services/studentService";
import { addStudentToClass } from "../../services/classService";

const AssignStudentModal = ({ classId, onClose, onSuccess }) => {
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await getStudents();
        const data = Array.isArray(res.data?.data) ? res.data.data : [];
        setStudents(data.filter((s) => s.role === "Eleve"));
      } catch {
        setError("Erreur chargement élèves");
      }
    };

    fetchStudents();
  }, []);

  const handleAssign = async () => {
    setError("");

    if (!classId) {
      setError("Classe invalide");
      return;
    }

    if (!studentId) {
      setError("Veuillez sélectionner un élève");
      return;
    }

    try {
      setLoading(true);

      console.log("ASSIGN:", {
        classId,
        studentId,
      });

      await addStudentToClass(classId, studentId );

      onSuccess();
    } catch (err) {
      console.error("BACKEND ERROR:", err.response?.data);
      setError("Erreur lors de l'affectation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Affecter un élève</h2>

        {error && <p className="text-red-600 mb-3">{error}</p>}

        <select
          className="w-full border p-2 rounded mb-4"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        >
          <option value="">-- Sélectionner un élève --</option>
          {students.map((s) => (
            <option key={s._id} value={s._id}>
              {s.lastName} {s.firstName} ({s.matricule})
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Annuler
          </button>
          <button
            onClick={handleAssign}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Affectation..." : "Valider"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignStudentModal;
