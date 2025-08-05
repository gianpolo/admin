import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const getToken = () => localStorage.getItem("token") || "";
const backend_url = import.meta.env.REACT_APP_BACKEND_URL || "http://localhost:5005/api/v1";

export const fetchSchedulingSessionDetails = createAsyncThunk(
  "sessionDetails/fetchSchedulingSessionDetails",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${backend_url}/schedulingplans/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Failed to fetch schedulingPlan");
      const { schedulingPlan, snapshot } = await res.json();
      return { schedulingPlan: schedulingPlan, snapshot: snapshot || null };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const performSelfschedulingAction = createAsyncThunk(
  "sessionDetails/performSelfschedulingAction",
  async ({ id, action }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${backend_url}/schedulingplans/${id}/${action}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Action failed");
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const generateSlots = createAsyncThunk(
  "sessionDetails/generateSlots",
  async (schedulingPlanId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${backend_url}/snapshots/slots/${schedulingPlanId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to generate slots");
      }
      return true;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const activateSnapshot = createAsyncThunk(
  "sessionDetails/activateSnapshot",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await fetch(`${backend_url}/schedulingplans/${payload.schedulingPlanId}/active-snapshot`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to activate snapshot");
      }
      return true;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const sessionDetailsSlice = createSlice({
  name: "sessionDetails",
  initialState: {
    schedulingPlan: null,
    status: "idle",
    error: "",
  },
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(fetchSchedulingSessionDetails.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(fetchSchedulingSessionDetails.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.schedulingPlan = payload.schedulingPlan;
      })
      .addCase(fetchSchedulingSessionDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(generateSlots.pending, (state) => {
        state.slotsStatus = "loading";
        state.slotsError = "";
      })
      .addCase(generateSlots.fulfilled, (state) => {
        state.slotsStatus = "succeeded";
      })
      .addCase(generateSlots.rejected, (state, action) => {
        state.slotsStatus = "failed";
        state.slotsError = action.payload;
      })
      .addCase(activateSnapshot.pending, (state) => {
        state.snapshotStatus = "loading";
        state.snapshotError = "";
      })
      .addCase(activateSnapshot.fulfilled, (state) => {
        state.snapshotStatus = "succeeded";
      })
      .addCase(activateSnapshot.rejected, (state, action) => {
        state.snapshotStatus = "failed";
        state.snapshotError = action.payload;
      })
      .addCase(performSelfschedulingAction.fulfilled, (state, { payload }) => {
        state.config = payload;
      }),
});
export default sessionDetailsSlice.reducer;
