import axios from "axios";

const API_URL = "http://localhost:5000/api/barters";

export const fetchBartersAPI = async (token) => {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const createBarterAPI = async (data, token) => {
  const res = await axios.post(API_URL, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
export const scheduleSessionAPI = async (id, data, token) => {
  const res = await axios.post(
    `${API_URL}/${id}/schedule`,
    data,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};
export const updateBarterStatusAPI = async (id, status, token) => {
  const res = await axios.put(
    `${API_URL}/${id}/status`,
    { status },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};