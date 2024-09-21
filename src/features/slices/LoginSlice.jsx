import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "login",
  initialState: {
    loggedIn: JSON.parse(localStorage.getItem("user")) || null,
  },
  reducers: {
    LoggedInUsers: (state, action) => {
      state.loggedIn = action.payload;
    },
    LoggedOutUsers: (state) => {
      state.loggedIn = null;
    },
  },
});

export const { LoggedInUsers, LoggedOutUsers } = userSlice.actions;

export default userSlice.reducer;