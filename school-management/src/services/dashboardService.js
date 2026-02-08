import api from "../api/axios";

export const getDashboardStats = async () => {
  const [studentsRes, classesRes] = await Promise.all([
    api.get("/students"),
    api.get("/classes"),
  ]);

  return {
    students: studentsRes.data?.data || [],
    classes: classesRes.data?.data || [],
  };
};
