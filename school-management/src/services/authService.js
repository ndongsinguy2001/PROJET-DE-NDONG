import api from "../api/axios";

export const login = async (credentials) => {
  const res = await api.post("/auth/login", credentials);

  if (res.data?.data) {
    localStorage.setItem("user", JSON.stringify(res.data.data));
    localStorage.setItem("token", res.data.data.token);
  }

  return res.data;
};

export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};
