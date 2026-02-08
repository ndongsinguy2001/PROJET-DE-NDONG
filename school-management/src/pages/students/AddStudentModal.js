
import { useEffect, useState } from "react";
import { createStudent, updateStudent } from "../../services/studentService";
import { getClasses } from "../../services/classService";

const AddEditStudentModal = ({ student, onClose, onSuccess }) => {
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    firstName: student?.firstName || "",
    lastName: student?.lastName || "",
    email: student?.email || "",
    password: "",
    matricule: student?.matricule || "",
    gender: student?.gender || "",
    dateOfBirth: student?.dateOfBirth?.substring(0, 10) || "",
    parentPhone: student?.parentPhone || "",
    address: student?.address || "",
    studentClass: student?.studentClass?._id || "",
  });

  useEffect(() => {
    getClasses().then((res) => setClasses(res.data.data || []));
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (student) {
      await updateStudent(student._id, formData);
    } else {
      await createStudent({ ...formData, role: "Eleve" });
    }
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl w-full max-w-xl space-y-4"
      >
        <h2 className="text-xl font-bold text-center">
          {student ? "Modifier élève" : "Ajouter élève"}
        </h2>

        <input name="firstName" placeholder="Prénom" className="input" value={formData.firstName} onChange={handleChange} />
        <input name="lastName" placeholder="Nom" className="input" value={formData.lastName} onChange={handleChange} />
        <input name="email" placeholder="Email" className="input" value={formData.email} onChange={handleChange} />

        {!student && (
          <input type="password" name="password" placeholder="Mot de passe" className="input" value={formData.password} onChange={handleChange} />
        )}

        <input name="matricule" placeholder="Matricule" className="input" value={formData.matricule} onChange={handleChange} />

        <select name="studentClass" className="input" value={formData.studentClass} onChange={handleChange}>
          <option value="">Sélectionner une classe</option>
          {classes.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name} ({c.level})
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose}>Annuler</button>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditStudentModal;
