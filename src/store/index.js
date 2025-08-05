import { configureStore } from "@reduxjs/toolkit";
import schedulingPlansReducer from "./schedulingPlansSlice.js";
import authReducer from "./authSlice.js";
import planDetailsReducer from "./planDetailsSlice.js";
import schedulingPlanFormReducer from "./schedulingPlanFormSlice.js";
import snapshotsReducer from "./snapshotsSlice.js";
import notificationsReducer from "./notificationsSlice.js";
import slotReducer from "./slotsSlice.js";
const store = configureStore({
  reducer: {
    auth: authReducer,
    schedulingPlans: schedulingPlansReducer,
    planDetails: planDetailsReducer,
    schedulingPlanForm: schedulingPlanFormReducer,
    snapshots: snapshotsReducer,
    notifications: notificationsReducer,
    slots: slotReducer,
  },
});

export default store;
