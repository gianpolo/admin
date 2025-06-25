import { configureStore } from "@reduxjs/toolkit";
import configurationsReducer from "./configurationsSlice.js";
import authReducer from "./authSlice.js";
import configDetailsReducer from "./configurationDetailsSlice.js";
import createConfigReducer from "./createConfigurationSlice.js"; 

const store = configureStore({
  reducer: {
    configurations: configurationsReducer,
    auth: authReducer,
    configDetails: configDetailsReducer,
    configForm: createConfigReducer,
  },
});

export default store;
