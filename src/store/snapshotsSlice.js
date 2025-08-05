import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchSchedulingSessionDetails } from "./sessionDetailsSlice";
const getToken = () => localStorage.getItem("token") || "";
const backend_url = import.meta.env.REACT_APP_BACKEND_URL || "http://localhost:5005/api/v1";

export const createSnapshot = createAsyncThunk("snapshots/createSnapshot", async (payload, { rejectWithValue }) => {
  try {
    const res = await fetch(`${backend_url}/snapshots`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Failed to create snapshot");
    }
    return true;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const activateSnapshot = createAsyncThunk("snapshots/activateSnapshot", async (payload, { rejectWithValue }) => {
  try {
    const res = await fetch(`${backend_url}/schedulingplans/${payload.schedulingPlanId}/active-snapshot`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" },
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
});

export const processSnapshot = createAsyncThunk(
  "snapshots/processSnapshot",
  async (snapshotId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${backend_url}/snapshots/${snapshotId}/process`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to process snapshot");
      }
      const data = await res.json();
      return { snapshotId, items: data };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
export const publishSnapshot = createAsyncThunk(
  "snapshots/publishSnapshot",
  async (snapshotId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${backend_url}/snapshots/${snapshotId}/publish-tourinstances`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
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
export const fetchSnapshotItems = createAsyncThunk(
  "snapshots/fetchSnapshotItems",
  async (snapshotId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${backend_url}/items/${snapshotId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to process snapshot");
      }
      const data = await res.json();
      return { snapshotId, items: data };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchTourSnapshots = createAsyncThunk(
  "snapshots/fetchTourSnapshots",
  async (snapshotId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${backend_url}/snapshots/${snapshotId}/tours`, {
        method: "GET",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to process snapshot");
      }
      const data = await res.json();
      return { snapshotId, tours: data };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchGuideSnapshots = createAsyncThunk(
  "snapshots/fetchTourSnapshots",
  async (snapshotId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${backend_url}/snapshots/${snapshotId}/guides`, {
        method: "GET",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to process snapshot");
      }
      const data = await res.json();
      return { snapshotId, guides: data };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
const createDetailState = () => ({
  summary: { data: null, status: "idle", error: null },
  tours: { data: null, status: "idle", error: null },
  items: { data: null, status: "idle", error: null },
});

const snapshotsSlice = createSlice({
  name: "snapshots",
  initialState: {
    list: [],
    details: {},
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchedulingSessionDetails.pending, (state, action) => {
        state.status = "loading";
        state.error = null;
        state.list = [];
      })
      .addCase(fetchSchedulingSessionDetails.fulfilled, (state, { payload }) => {
        state.list = payload.schedulingPlan.snapshots;
        state.status = "succeeded";

        if (!payload.snapshot) return;
        const { snapshotId } = payload.snapshot;
        if (!state.details[snapshotId]) state.details[snapshotId] = createDetailState();
        if (snapshotId) {
          state.details[snapshotId].summary.status = "succeeded";
          state.details[snapshotId].summary.data = payload.snapshot;
        }
      })
      .addCase(fetchSchedulingSessionDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createSnapshot.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createSnapshot.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(createSnapshot.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(activateSnapshot.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(activateSnapshot.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(activateSnapshot.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(processSnapshot.pending, (state) => {
        state.status = "loading";
      })
      .addCase(processSnapshot.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        if (payload && payload.snapshotId) {
          if (!state.details[payload.snapshotId]) {
            state.details[payload.snapshotId] = {};
          }
          state.details[payload.snapshotId].items = payload.items;
        }
      })
      .addCase(processSnapshot.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
    // --- Tours ---
    builder
      .addCase(fetchTourSnapshots.pending, (state, action) => {
        const id = action.meta.arg;
        if (!state.details[id]) state.details[id] = createDetailState();
        state.details[id].items.status = "loading";
        state.details[id].tours.error = null;
      })
      .addCase(fetchTourSnapshots.fulfilled, (state, action) => {
        const { snapshotId, tours } = action.payload;
        state.details[snapshotId].tours.status = "succeeded";
        state.details[snapshotId].tours.data = tours;
      })
      .addCase(fetchTourSnapshots.rejected, (state, action) => {
        const id = action.meta.arg;
        state.details[id].tours.status = "failed";
        state.details[id].tours.error = action.error.message;
      });

    // --- Items ---
    builder
      .addCase(fetchSnapshotItems.pending, (state, action) => {
        const id = action.meta.arg;
        if (!state.details[id]) state.details[id] = createDetailState();
        state.details[id].items.status = "loading";
        state.details[id].items.error = null;
      })
      .addCase(fetchSnapshotItems.fulfilled, (state, action) => {
        const { snapshotId, items } = action.payload;
        state.details[snapshotId].items.status = "succeeded";
        state.details[snapshotId].items.data = items;
      })
      .addCase(fetchSnapshotItems.rejected, (state, action) => {
        const id = action.meta.arg;
        state.details[id].items.status = "failed";
        state.details[id].items.error = action.error.message;
      });
  },
});

export default snapshotsSlice.reducer;
