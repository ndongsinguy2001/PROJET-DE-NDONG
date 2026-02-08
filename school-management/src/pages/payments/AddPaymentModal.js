import { useEffect, useState } from "react";
import { createPayment } from "../../services/paymentService";
import api from "../../api/axios";

const AddPaymentModal = ({ onClose, onSuccess }) => {
  const [students, setStudents] = useState([]);
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
    await createPayment(form);
    onSuccess();
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
          className="input"
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
          className="input"
          required
        />

        <input
          type="number"
          name="amount"
          placeholder="Montant"
          onChange={handleChange}
          className="input"
          required
        />

        <select
          name="method"
          onChange={handleChange}
          className="input"
        >
          <option>Espèces</option>
          <option>Mobile Money</option>
          <option>Virement</option>
          <option>Chèque</option>
        </select>

        <input
          name="reference"
          placeholder="Référence (optionnel)"
          onChange={handleChange}
          className="input"
        />

        <div className="flex justify-end gap-3 pt-3">
          <button type="button" onClick={onClose}>
            Annuler
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPaymentModal;
