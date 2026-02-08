
import { useEffect, useState } from "react";
import {
  getPayments,
  deletePayment,
} from "../../services/paymentService";
import AddPaymentModal from "./AddPaymentModal";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchPayments = async () => {
    const res = await getPayments();
    setPayments(res.data.data || []);
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const totalPaid = payments.reduce(
    (sum, p) => sum + p.amount,
    0
  );

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce paiement ?")) return;
    await deletePayment(id);
    fetchPayments();
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Paiements</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Nouveau paiement
        </button>
      </div>

      {/* STATS */}
      <div className="mb-4 bg-green-100 p-4 rounded">
        <strong>Total encaissé :</strong>{" "}
        {totalPaid.toLocaleString()} FCFA
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Élève</th>
              <th className="p-3">Classe</th>
              <th className="p-3">Type</th>
              <th className="p-3">Montant</th>
              <th className="p-3">Méthode</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p._id} className="border-t">
                <td className="p-3">
                  {p.student?.lastName} {p.student?.firstName}
                </td>
                <td className="p-3">
                  {p.class?.name}
                </td>
                <td className="p-3">{p.feeType}</td>
                <td className="p-3">
                  {p.amount.toLocaleString()} FCFA
                </td>
                <td className="p-3">{p.method}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="text-red-600 hover:underline"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}

            {payments.length === 0 && (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  Aucun paiement enregistré
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <AddPaymentModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchPayments();
          }}
        />
      )}
    </div>
  );
};

export default Payments;