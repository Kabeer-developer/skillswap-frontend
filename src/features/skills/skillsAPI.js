import api from "../../api/axiosInstance";

export const fetchSkillsAPI = async () => {
  const res = await api.get("/api/skills");
  return res.data;
};

export const createSkillAPI = async (skillData) => {
  const res = await api.post("/api/skills", skillData);
  return res.data;
};