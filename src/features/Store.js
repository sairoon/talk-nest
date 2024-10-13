import { configureStore } from "@reduxjs/toolkit";
import LoginSlice from "./slices/LoginSlice";
import ActiveChatSlice from "./slices/ActiveChatSlice";

const store = configureStore({
  reducer: {
    login: LoginSlice,
    active: ActiveChatSlice,
  },
});

export default store;
