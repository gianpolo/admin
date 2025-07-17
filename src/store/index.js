import { configureStore } from "@reduxjs/toolkit";
import selfschedulingsReducer from "./selfschedulingsSlice.js";
import authReducer from "./authSlice.js";
import selfschedulingDetailsReducer from "./selfschedulingDetailsSlice.js";
import selfschedulingFormReducer from "./selfschedulingFormSlice.js";
import snapshotsReducer from "./snapshotsSlice.js";
import notificationsReducer from "./notificationsSlice.js";
import slotReducer from "./slotsSlice.js";
const store = configureStore({
  reducer: {
    auth: authReducer,
    selfschedulings: selfschedulingsReducer,
    selfschedulingDetails: selfschedulingDetailsReducer,
    selfschedulingForm: selfschedulingFormReducer,
    snapshots: snapshotsReducer,
    notifications: notificationsReducer,
    slots: slotReducer,
  },
});

export default store;
