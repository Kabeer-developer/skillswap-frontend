import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchSkillsAPI, createSkillAPI } from "./skillsAPI";

export const fetchSkills = createAsyncThunk(
  "skills/fetchSkills",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await fetchSkillsAPI(token);
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch skills");
    }
  }
);

export const createSkill = createAsyncThunk(
  "skills/createSkill",
  async (skillData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await createSkillAPI(skillData, token);
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to create skill");
    }
  }
);

const skillsSlice = createSlice({
  name: "skills",
  initialState: {
    skills: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSkills.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSkills.fulfilled, (state, action) => {
        state.loading = false;
        state.skills = action.payload;
      })
      .addCase(fetchSkills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createSkill.fulfilled, (state, action) => {
        state.skills.push(action.payload);
      });
  },
});

export default skillsSlice.reducer;