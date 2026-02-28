import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createReviewAPI, fetchReviewsAPI } from "./reviewsAPI";

export const fetchReviews = createAsyncThunk(
  "reviews/fetch",
  async (userId) => {
    return await fetchReviewsAPI(userId);
  }
);

export const createReview = createAsyncThunk(
  "reviews/create",
  async (data, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;
    return await createReviewAPI(data, token);
  }
);

const reviewsSlice = createSlice({
  name: "reviews",
  initialState: {
    reviews: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.reviews = action.payload;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.reviews.push(action.payload);
      });
  },
});

export default reviewsSlice.reducer;