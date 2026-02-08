
import { useEffect, useState } from "react";
import {
  getGrades,
  deleteGrade,
  getGradesByClass,
} from "../../services/gradeService";
import { getStudents } from "../../services/studentService";
import { getClasses } from "../../services/classService";
import AddEditGradeModal from "./AddEditGradeModal";

const Grades = () => {
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [showModal, setShowModal] = useState(false);

  const fetchGrades = async () => {
    const res = await getGrades();
    setGrades(res.data.data || []);
  };

  const fetchStudents = async () => {
    const res = await getStudents();
    setStudents(res.data.data || []);
  };

  const fetchClasses = async () => {
    const res = await getClasses();
    setClasses(res.data.data || []);
  };

  useEffect(() => {
    fetchGrades();
    fetchStudents();
    fetchClasses();
  }, []);

  const handleFilterByClass = async (classId) => {
    setSelectedClass(classId);

    if (!classId) {
      fetchGrades();
      return;
    }

    const res = await getGradesByClass(classId);
    setGrades(res.data.data || []);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette note ?")) return;
    await deleteGrade(id);
    fetchGrades();
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notes</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Ajouter une note
        </button>
      </div>

      {/* FILTRE CLASSE */}
      <div className="mb-4">
        <select
          value={selectedClass}
          onChange={(e) => handleFilterByClass(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Toutes les classes</option>
          {classes.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name} ({c.level})
            </option>
          ))}
        </select>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Élève</th>
              <th className="p-3">Classe</th>
              <th className="p-3">Matière</th>
              <th className="p-3">Note</th>
              <th className="p-3">Type</th>
              <th className="p-3">Trimestre</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((g) => (
              <tr key={g._id} className="border-t">
                <td className="p-3">
                  {g.student?.firstName} {g.student?.lastName}
                </td>
                <td className="p-3">
                  {g.class?.name} ({g.class?.level})
                </td>
                <td className="p-3">{g.subject}</td>
                <td className="p-3 font-bold">{g.score}/20</td>
                <td className="p-3">{g.examType}</td>
                <td className="p-3">{g.term}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleDelete(g._id)}
                    className="text-red-600 hover:underline"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}

            {grades.length === 0 && (
              <tr>
                <td colSpan="7" className="p-6 text-center text-gray-500">
                  Aucune note trouvée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <AddEditGradeModal
          students={students}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchGrades();
          }}
        />
      )}
    </div>
  );
};

export default Grades;
