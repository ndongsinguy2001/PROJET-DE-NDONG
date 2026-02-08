
import api from "../api/axios";

export const getClasses = () => api.get("/classes");
export const getClassById = (id) => api.get(`/classes/${id}`);
export const createClass = (data) => api.post("/classes", data);
export const updateClass = (id, data) => api.put(`/classes/${id}`, data);
export const deleteClass = (id) => api.delete(`/classes/${id}`);

export const addStudentToClass = (classId, studentId) =>
  api.post(`/classes/${classId}/students`, { studentId });

export const removeStudentFromClass = (classId, studentId) =>
  api.delete(`/classes/${classId}/students/${studentId}`);
