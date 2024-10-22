import { configureStore } from "@reduxjs/toolkit";
import homeSlice  from "./slice/HomeSlice";
import  profileSlice  from "./slice/ProfileSlice";


export const store = configureStore({
  reducer: {
    profile: profileSlice,
    home: homeSlice
  },
})