import { useEffect, useState } from "react";
import { createPayment } from "../../services/paymentService";
import api from "../../api/axios";
import toast from "react-hot-toast";

const AddPaymentModal = ({ onClose, onSuccess }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    student: "",
    feeType: "",
    amount: "",
    method: "Espèces",
    reference: "",
  });

  useEffect(() => {
    api.get("/students").then((res) => {
      setStudents(res.data.data || []);
    });
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createPayment(form);
      toast.success("Paiement enregistré avec succès");
      onSuccess();
    } catch {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded w-full max-w-md space-y-3"
      >
        <h2 className="text-xl font-bold">Nouveau paiement</h2>

        <select
          name="student"
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        >
          <option value="">-- Élève --</option>
          {students.map((s) => (
            <option key={s._id} value={s._id}>
              {s.lastName} {s.firstName} ({s.matricule})
            </option>
          ))}
        </select>

        <input
          name="feeType"
          placeholder="Type de frais"
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />

        <input
          type="number"
          name="amount"
          placeholder="Montant"
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />

        <select name="method" onChange={handleChange} className="border p-2 rounded w-full">
          <option>Espèces</option>
          <option>Mobile Money</option>
          <option>Virement</option>
          <option>Chèque</option>
        </select>

        <input
          name="reference"
          placeholder="Référence (optionnel)"
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        <div className="flex justify-end gap-3 pt-3">
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

export default AddPaymentModal;