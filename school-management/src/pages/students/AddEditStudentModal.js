import { useState, useEffect } from "react";
import { createStudent, updateStudent } from "../../services/studentService";
import { getClasses } from "../../services/classService";

const AddEditStudentModal = ({ student, onClose, onSuccess }) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    firstName: student?.firstName || "",
    lastName: student?.lastName || "",
    email: student?.email || "",
    password: "",
    matricule: student?.matricule || "",
    gender: student?.gender || "",
    dateOfBirth: student?.dateOfBirth
      ? student.dateOfBirth.substring(0, 10)
      : "",
    parentPhone: student?.parentPhone || "",
    address: student?.address || "",
    studentClass: student?.studentClass || "",
  });

  
  // CHARGER LES CLASSES
  
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await getClasses();

        //  STRUCTURE BACKEND : { success, count, data }
        setClasses(res.data.data || []);
      } catch (err) {
        console.error("Erreur chargement classes :", err);
        setClasses([]);
      }
    };

    fetchClasses();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
  // SUBMIT
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      if (student) {
        await updateStudent(student._id, formData);
      } else {
        await createStudent({
          ...formData,
          role: "Eleve", //  OBLIGATOIRE
        });
      }

      onSuccess();
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("Erreur lors de l'enregistrement de l'élève");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-xl">
        <h2 className="text-xl font-bold mb-4 text-center">
          {student ? "Modifier l’élève" : "Ajouter un élève"}
        </h2>

        {error && (
          <p className="text-red-600 mb-3 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* NOMS */}
          <div className="grid grid-cols-2 gap-4">
            <input
              name="firstName"
              placeholder="Prénom"
              required
              className="input"
              value={formData.firstName}
              onChange={handleChange}
            />
            <input
              name="lastName"
              placeholder="Nom"
              required
              className="input"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>

          {/* EMAIL + PASSWORD */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="input"
              value={formData.email}
              onChange={handleChange}
            />
            {!student && (
              <input
                type="password"
                name="password"
                placeholder="Mot de passe"
                required
                className="input"
                value={formData.password}
                onChange={handleChange}
              />
            )}
          </div>

          {/* MATRICULE + GENRE */}
          <div className="grid grid-cols-2 gap-4">
            <input
              name="matricule"
              placeholder="Matricule"
              required
              className="input"
              value={formData.matricule}
              onChange={handleChange}
            />
            <select
              name="gender"
              required
              className="input"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Genre</option>
              <option value="M">Masculin</option>
              <option value="F">Féminin</option>
            </select>
          </div>

          {/* DATE */}
          <input
            type="date"
            name="dateOfBirth"
            required
            className="input"
            value={formData.dateOfBirth}
            onChange={handleChange}
          />

          {/* PARENT + ADRESSE */}
          <input
            name="parentPhone"
            placeholder="Téléphone parent"
            required
            className="input"
            value={formData.parentPhone}
            onChange={handleChange}
          />
          <input
            name="address"
            placeholder="Adresse"
            required
            className="input"
            value={formData.address}
            onChange={handleChange}
          />

          {/*  CLASSE  */}
          <select
            name="studentClass"
            value={formData.studentClass}
            onChange={handleChange}
            required
            className="input"
          >
            <option value="">Sélectionner une classe</option>
            {classes.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name} ({c.level})
              </option>
            ))}
          </select>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="border px-4 py-2 rounded"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-5 py-2 rounded"
            >
              {loading ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditStudentModal;
