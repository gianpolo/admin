import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchSchedulingPlanDetails } from "./planDetailsSlice";
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
export const fetchExperiencesSnapshots = createAsyncThunk(
  "snapshots/fetchExperiencesSnapshots",
  async (snapshotId, { rejectWithValue }) => {
    const url = `${backend_url}/snapshots/${snapshotId}/tours`;
    const res = await fetchSnapshot(url, rejectWithValue);
    console.log(`${backend_url}/snapshots/${snapshotId}/tours`, res);
    return { snapshotId, experiences: res };
  }
);
export const fetchForecastsSnapshots = createAsyncThunk(
  "snapshots/fetchForecastsSnapshots",
  async (snapshotId, { rejectWithValue }) => {
    const url = `${backend_url}/snapshots/${snapshotId}/forecasts`;
    const res = await fetchSnapshot(url, rejectWithValue);
    console.log(`${backend_url}/snapshots/${snapshotId}/forecasts`, res);
    return { snapshotId, forecasts: res };
  }
);
export const fetchAudienceSnapshots = createAsyncThunk(
  "snapshots/fetchAudienceSnapshots",
  async (snapshotId, { rejectWithValue }) => {
    const url = `${backend_url}/snapshots/${snapshotId}/audience`;
    const res = await fetchSnapshot(url, rejectWithValue);
    console.log(`${backend_url}/snapshots/${snapshotId}/audience`, res);
    return { snapshotId, audience: res };
  }
);

export const fetchAllocationsSnapshots = createAsyncThunk(
  "snapshots/fetchAllocationsSnapshots",
  async (snapshotId, { rejectWithValue }) => {
    const url = `${backend_url}/snapshots/${snapshotId}/allocations`;
    const res = await fetchSnapshot(url, rejectWithValue);
    console.log(`${backend_url}/snapshots/${snapshotId}/allocations`, res);
    return { snapshotId, allocations: res };
  }
);

const fetchSnapshot = async (url, rejectWithValue) => {
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Failed to process snapshot");
    }
    return await res.json();
  } catch (err) {
    return rejectWithValue(err.message);
  }
};
const createDetailState = () => ({
  summary: { data: null, status: "idle", error: null },
  experiences: { data: null, status: "idle", error: null },
  forecasts: { data: null, status: "idle", error: null },
  audience: { data: null, status: "idle", error: null },
  allocations: { data: null, status: "idle", error: null },
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
      .addCase(fetchSchedulingPlanDetails.pending, (state, action) => {
        state.status = "loading";
        state.error = null;
        state.list = [];
      })
      .addCase(fetchSchedulingPlanDetails.fulfilled, (state, { payload }) => {
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
      .addCase(fetchSchedulingPlanDetails.rejected, (state, action) => {
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
    // --- Experiences ---
    builder
      .addCase(fetchExperiencesSnapshots.pending, (state, action) => {
        const id = action.meta.arg;
        if (!state.details[id]) state.details[id] = createDetailState();
        state.details[id].experiences.status = "loading";
        state.details[id].experiences.error = null;
      })
      .addCase(fetchExperiencesSnapshots.fulfilled, (state, action) => {
        const { snapshotId, experiences } = action.payload;
        state.details[snapshotId].experiences.status = "succeeded";
        state.details[snapshotId].experiences.data = experiences;
      })
      .addCase(fetchExperiencesSnapshots.rejected, (state, action) => {
        const id = action.meta.arg;
        state.details[id].experiences.status = "failed";
        state.details[id].experiences.error = action.error.message;
      });
    //Forecasts
    builder
      .addCase(fetchForecastsSnapshots.pending, (state, action) => {
        const id = action.meta.arg;
        if (!state.details[id]) state.details[id] = createDetailState();
        state.details[id].forecasts.status = "loading";
        state.details[id].forecasts.error = null;
      })
      .addCase(fetchForecastsSnapshots.fulfilled, (state, action) => {
        const { snapshotId, forecasts } = action.payload;
        state.details[snapshotId].forecasts.status = "succeeded";
        state.details[snapshotId].forecasts.data = forecasts;
      })
      .addCase(fetchForecastsSnapshots.rejected, (state, action) => {
        const snapshotId = action.meta.arg;
        state.details[snapshotId].forecasts.status = "failed";
        state.details[snapshotId].forecasts.error = action.error.message;
      });
    //Audience
    builder
      .addCase(fetchAudienceSnapshots.pending, (state, action) => {
        const snapshotId = action.meta.arg;
        if (!state.details[snapshotId]) state.details[snapshotId] = createDetailState();
        state.details[snapshotId].audience.status = "loading";
        state.details[snapshotId].audience.error = null;
      })
      .addCase(fetchAudienceSnapshots.fulfilled, (state, action) => {
        const { snapshotId, audience } = action.payload;
        state.details[snapshotId].audience.status = "succeeded";
        state.details[snapshotId].audience.data = audience;
      })
      .addCase(fetchAudienceSnapshots.rejected, (state, action) => {
        const id = action.meta.arg;
        state.details[id].audience.status = "failed";
        state.details[id].audience.error = action.error.message;
      });
    // --- Allocations ---
    builder
      .addCase(fetchAllocationsSnapshots.pending, (state, action) => {
        const id = action.meta.arg;
        if (!state.details[id]) state.details[id] = createDetailState();
        state.details[id].allocations.status = "loading";
        state.details[id].allocations.error = null;
      })
      .addCase(fetchAllocationsSnapshots.fulfilled, (state, action) => {
        const { snapshotId, allocations } = action.payload;
        state.details[snapshotId].allocations.status = "succeeded";
        state.details[snapshotId].allocations.data = allocations;
      })
      .addCase(fetchAllocationsSnapshots.rejected, (state, action) => {
        const id = action.meta.arg;
        state.details[id].allocations.status = "failed";
        state.details[id].allocations.error = action.error.message;
      });
  },
});

export default snapshotsSlice.reducer;
