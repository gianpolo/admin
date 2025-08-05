import { configureStore } from "@reduxjs/toolkit";
import schedulingSessionReducer from "./schedulingSessionsSlice.js";
import authReducer from "./authSlice.js";
import sessionDetailsReducer from "./sessionDetailsSlice.js";
import schedulingSessionFormReducer from "./schedulingSessionFormSlice.js";
import snapshotsReducer from "./snapshotsSlice.js";
import notificationsReducer from "./notificationsSlice.js";
import slotReducer from "./slotsSlice.js";
const store = configureStore({
  reducer: {
    auth: authReducer,
    schedulingPlan: schedulingSessionReducer,
    sessionDetails: sessionDetailsReducer,
    schedulingSessionForm: schedulingSessionFormReducer,
    snapshots: snapshotsReducer,
    notifications: notificationsReducer,
    slots: slotReducer,
  },
});

export default store;
