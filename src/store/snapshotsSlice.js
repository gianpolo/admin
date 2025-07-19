import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchSelfschedulingDetails } from "./selfschedulingDetailsSlice";
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
    const res = await fetch(`${backend_url}/selfschedulings/${payload.selfSchedulingId}/active-snapshot`, {
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

export const fetchSnapshotDetails = createAsyncThunk(
  "snapshots/fetchSnapshotDetails",
  async (snapshotId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${backend_url}/snapshots/${snapshotId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Failed to fetch snapshot details");
      const data = await res.json();
      return { snapshotId, data };
    } catch (err) {
      return rejectWithValue({ snapshotId, error: err.message });
    }
  },
  {
    condition: (snapshotId, { getState }) => {
      const entry = getState().snapshots.details[snapshotId];
      return !entry;
    },
  }
);

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
      .addCase(fetchSelfschedulingDetails.pending, (state) => {
        state.status = "loading";
        state.error = "";
        state.list = [];
      })
      .addCase(fetchSelfschedulingDetails.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.list = payload.selfscheduling.snapshots || [];
        const id = payload.snapshot?.snapshotSummary?.snapshotId;
        if (id) {
          state.details[id] = payload.snapshot;
        }
      })
      .addCase(fetchSelfschedulingDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchSnapshotDetails.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSnapshotDetails.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.details[payload.snapshotId] = { ...payload.data };
      })
      .addCase(fetchSnapshotDetails.rejected, (state, { payload }) => {
        state.status = "failed";
        state.error = payload.error;
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
      });
  },
});

export default snapshotsSlice.reducer;
