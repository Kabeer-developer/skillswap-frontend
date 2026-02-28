import api from "../../api/axiosInstance";

export const createReviewAPI = async (data) => {
  const res = await api.post("/api/reviews", data);
  return res.data;
};

export const fetchReviewsAPI = async (userId) => {
  const res = await api.get(`/api/reviews/${userId}`);
  return res.data;
};