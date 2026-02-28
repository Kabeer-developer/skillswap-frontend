import api from "../../api/axiosInstance";

export const fetchBartersAPI = async () => {
  const res = await api.get("/api/barters");
  return res.data;
};

export const createBarterAPI = async (data) => {
  const res = await api.post("/api/barters", data);
  return res.data;
};

export const updateBarterStatusAPI = async (id, status) => {
  const res = await api.put(`/api/barters/${id}/status`, { status });
  return res.data;
};

export const scheduleSessionAPI = async (id, data) => {
  const res = await api.post(`/api/barters/${id}/schedule`, data);
  return res.data;
};