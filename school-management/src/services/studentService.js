import api from "../api/axios";

export const getStudents = async () => {
  return api.get("/students");
};

export const createStudent = async (data) => {
  return api.post("/students", data);
};

export const updateStudent = async (id, data) => {
  return api.put(`/students/${id}`, data);
};

export const deleteStudent = async (id) => {
  return api.delete(`/students/${id}`);
};
