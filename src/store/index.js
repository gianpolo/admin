import { configureStore } from "@reduxjs/toolkit";
import selfschedulingsReducer from "./selfschedulingsSlice.js";
import authReducer from "./authSlice.js";
import configDetailsReducer from "./selfschedulingDetailsSlice.js";
import createConfigReducer from "./createSelfSchedulingSlice.js";
import notificationsReducer from "./notificationsSlice.js";
import itemsReducer from "./itemSlice.js";

const store = configureStore({
  reducer: {
    selfschedulings: selfschedulingsReducer,
    auth: authReducer,
    selfschedulingsDetails: configDetailsReducer,
    selfschedulingForm: createConfigReducer,
    notifications: notificationsReducer,
    items: itemsReducer,
  },
});

export default store;
