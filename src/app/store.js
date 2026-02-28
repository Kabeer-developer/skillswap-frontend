import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import skillsReducer from "../features/skills/skillsSlice";
import bartersReducer from "../features/barters/bartersSlice";
import chatReducer from "../features/chat/chatSlice";
import reviewsReducer from "../features/reviews/reviewsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    skills: skillsReducer,
    barters: bartersReducer,
    chat: chatReducer,
    reviews: reviewsReducer,
  },
});