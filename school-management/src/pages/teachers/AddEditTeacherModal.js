import { useState } from "react";
import { createTeacher } from "../../services/teacherService";
import toast from "react-hot-toast";

const AddEditTeacherModal = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    qualification: "",
    password: "",
    gender: "M",
    dateOfBirth: "",
    address: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createTeacher(form);
      toast.success("Enseignant ajouté avec succès");
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur lors de la création");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded w-full max-w-lg"
      >
        <h2 className="text-xl font-bold mb-4">Nouvel enseignant</h2>

        <div className="grid grid-cols-2 gap-3">
          <input
            name="firstName"
            placeholder="Prénom"
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            name="lastName"
            placeholder="Nom"
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
        </div>

        <input
          name="email"
          placeholder="Email"
          type="email"
          onChange={handleChange}
          required
          className="border p-2 rounded w-full mt-2"
        />

        <input
          name="phone"
          placeholder="Téléphone"
          onChange={handleChange}
          className="border p-2 rounded w-full mt-2"
        />

        <input
          name="subject"
          placeholder="Matière"
          onChange={handleChange}
          className="border p-2 rounded w-full mt-2"
        />

        <input
          name="qualification"
          placeholder="Qualification"
          onChange={handleChange}
          className="border p-2 rounded w-full mt-2"
        />

        <input
          type="date"
          name="dateOfBirth"
          onChange={handleChange}
          required
          className="border p-2 rounded w-full mt-2"
        />

        <select
          name="gender"
          onChange={handleChange}
          value={form.gender}
          className="border p-2 rounded w-full mt-2"
        >
          <option value="M">Masculin</option>
          <option value="F">Féminin</option>
        </select>

        <input
          name="address"
          placeholder="Adresse"
          onChange={handleChange}
          required
          className="border p-2 rounded w-full mt-2"
        />

        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          onChange={handleChange}
          required
          className="border p-2 rounded w-full mt-2"
        />

        <div className="flex justify-end gap-3 mt-6">
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

export default AddEditTeacherModal;