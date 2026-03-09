import { useState, useEffect } from "react";
import { createStudent, updateStudent } from "../../services/studentService";
import { getClasses } from "../../services/classService";
import toast from "react-hot-toast";

const AddEditStudentModal = ({ student, onClose, onSuccess }) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
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
    studentClass: student?.studentClass?._id || student?.studentClass || "",
  });

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await getClasses();
        setClasses(res.data.data || []);
      } catch {
        toast.error("Erreur lors du chargement des classes");
      }
    };
    fetchClasses();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (student) {
        await updateStudent(student._id, formData);
        toast.success("Élève modifié avec succès");
      } else {
        await createStudent({ ...formData, role: "Eleve" });
        toast.success("Élève ajouté avec succès");
      }
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-center">
          {student ? "Modifier l'élève" : "Ajouter un élève"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              name="firstName"
              placeholder="Prénom"
              required
              className="border p-2 rounded"
              value={formData.firstName}
              onChange={handleChange}
            />
            <input
              name="lastName"
              placeholder="Nom"
              required
              className="border p-2 rounded"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="border p-2 rounded"
              value={formData.email}
              onChange={handleChange}
            />
            {!student && (
              <input
                type="password"
                name="password"
                placeholder="Mot de passe"
                required
                className="border p-2 rounded"
                value={formData.password}
                onChange={handleChange}
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              name="matricule"
              placeholder="Matricule"
              required
              className="border p-2 rounded"
              value={formData.matricule}
              onChange={handleChange}
            />
            <select
              name="gender"
              required
              className="border p-2 rounded"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Genre</option>
              <option value="M">Masculin</option>
              <option value="F">Féminin</option>
            </select>
          </div>

          <input
            type="date"
            name="dateOfBirth"
            required
            className="border p-2 rounded w-full"
            value={formData.dateOfBirth}
            onChange={handleChange}
          />

          <input
            name="parentPhone"
            placeholder="Téléphone parent"
            required
            className="border p-2 rounded w-full"
            value={formData.parentPhone}
            onChange={handleChange}
          />

          <input
            name="address"
            placeholder="Adresse"
            required
            className="border p-2 rounded w-full"
            value={formData.address}
            onChange={handleChange}
          />

          <select
            name="studentClass"
            value={formData.studentClass}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          >
            <option value="">Sélectionner une classe</option>
            {classes.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name} ({c.level})
              </option>
            ))}
          </select>

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
              className="bg-blue-600 text-white px-5 py-2 rounded disabled:opacity-50"
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