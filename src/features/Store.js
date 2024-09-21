import { configureStore } from "@reduxjs/toolkit";
import LoginSlice from "./slices/LoginSlice";

const store = configureStore({
    reducer: {
        login: LoginSlice,
    },
});

export default store