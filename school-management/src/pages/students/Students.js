
import { useEffect, useState } from "react";
import { getStudents, deleteStudent } from "../../services/studentService";
import AddEditStudentModal from "./AddEditStudentModal";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const fetchStudents = async () => {
    const res = await getStudents();
    setStudents(res.data.data || []);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Élèves</h1>
        <button
          onClick={() => {
            setSelectedStudent(null);
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Ajouter un élève
        </button>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Nom</th>
            <th className="p-2 text-left">Classe</th>
            <th className="p-2 text-left">Matricule</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s._id} className="border-t">
              <td className="p-2">{s.lastName} {s.firstName}</td>
              <td className="p-2">
                {s.studentClass
                  ? `${s.studentClass.name} (${s.studentClass.level})`
                  : "-"}
              </td>
              <td className="p-2">{s.matricule}</td>
              <td className="p-2 flex gap-3">
                <button
                  onClick={() => {
                    setSelectedStudent(s);
                    setShowModal(true);
                  }}
                  className="text-blue-600"
                >
                  Modifier
                </button>
                <button
                  onClick={() => deleteStudent(s._id).then(fetchStudents)}
                  className="text-red-600"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <AddEditStudentModal
          student={selectedStudent}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchStudents();
          }}
        />
      )}
    </div>
  );
};

export default Students;
