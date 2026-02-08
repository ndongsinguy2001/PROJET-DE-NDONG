import api from "../api/axios";

export const getPayments = () => api.get("/payments");

export const createPayment = (data) =>
  api.post("/payments", data);

export const deletePayment = (id) =>
  api.delete(`/payments/${id}`);

