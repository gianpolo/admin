import { configureStore } from "@reduxjs/toolkit";
import configurationsReducer from "./configurationsSlice.js";

const store = configureStore({
  reducer: {
    configurations: configurationsReducer,
  },
});

export default store;
