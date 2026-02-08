import api from "../api/axios";

export const getGrades = () => api.get("/grades");

export const createGrade = (data) => api.post("/grades", data);

export const deleteGrade = (id) => api.delete(`/grades/${id}`);

export const getGradesByClass = (className) =>
  api.get(`/grades/class/${className}`);

export const getGradesByStudent = (studentId) =>
  api.get(`/grades/student/${studentId}`);
