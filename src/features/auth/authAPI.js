import api from "../../api/axiosInstance";

export const registerUserAPI = async (userData) => {
  const res = await api.post("/api/auth/register", userData);
  return res.data;
};

export const loginUserAPI = async (userData) => {
  const res = await api.post("/api/auth/login", userData);
  return res.data;
};