import { createSlice } from "@reduxjs/toolkit";

export const ActiveChatSlice = createSlice({
  name: "chat",
  initialState: {
    active: JSON.parse(localStorage.getItem("active")) || null,
  },
  reducers: {
    ActiveChat: (state, action) => {
      state.active = action.payload;
    },
  },
});

export const { ActiveChat } = ActiveChatSlice.actions;

export default ActiveChatSlice.reducer;
