import axios from "axios";

const API_URL = "http://localhost:5000/api/skills";

export const fetchSkillsAPI = async (token) => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createSkillAPI = async (skillData, token) => {
  const response = await axios.post(API_URL, skillData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};