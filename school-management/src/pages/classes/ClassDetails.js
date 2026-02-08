import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getClassById,
  removeStudentFromClass,
} from "../../services/classService";
import AssignStudentModal from "./AssignStudentModal";

const ClassDetails = () => {
  const { id } = useParams();
  const [classData, setClassData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchClass = async () => {
    const res = await getClassById(id);
    setClassData(res.data.data);
  };

  useEffect(() => {
    fetchClass();
  }, [id]);

  if (!classData) return <p>Chargement...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{classData.name}</h1>

      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        + Affecter un élève
      </button>

      <ul className="space-y-2">
        {classData.students.map((s) => (
          <li
            key={s._id}
            className="flex justify-between border p-2 rounded"
          >
            <span>{s.lastName} {s.firstName}</span>
            <button
              onClick={() =>
                removeStudentFromClass(id, s._id).then(fetchClass)
              }
              className="text-red-600"
            >
              Retirer
            </button>
          </li>
        ))}
      </ul>

      {showModal && (
        <AssignStudentModal
          classId={id}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchClass();
          }}
        />
      )}
    </div>
  );
};

export default ClassDetails;
