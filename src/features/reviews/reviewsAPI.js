import axios from "axios";

const API_URL = "http://localhost:5000/api/reviews";

export const createReviewAPI = async (data, token) => {
  const res = await axios.post(API_URL, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const fetchReviewsAPI = async (userId) => {
  const res = await axios.get(`${API_URL}/${userId}`);
  return res.data;
};