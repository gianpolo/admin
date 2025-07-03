import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const getToken = () => localStorage.getItem("token") || "";
const backend_url =
  import.meta.env.REACT_APP_BACKEND_URL || "http://localhost:5005/api/v1";

export const fetchSelfSchedulingDetails = createAsyncThunk(
  "selfschedulingDetails/fetchSelfSchedulingDetails",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${backend_url}/selfschedulings/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Failed to fetch selfscheduling");
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchTourItems = createAsyncThunk(
  "selfschedulingDetails/fetchTourItems",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${backend_url}/items?selfSchedulingId=${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Failed to fetch tour items");
      const data = await res.json();
      return Array.isArray(data) ? data : data.items || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const performConfigurationAction = createAsyncThunk(
  "selfschedulingDetails/performConfigurationAction",
  async ({ id, action }, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${backend_url}/selfschedulings/${id}/${action}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      if (!res.ok) throw new Error("Action failed");
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const generateSlots = createAsyncThunk(
  "selfschedulingDetails/generateSlots",
  async (selfSchedulingId, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${backend_url}/items/slots/${selfSchedulingId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
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

export const createSnapshot = createAsyncThunk(
  "selfschedulingDetails/createSnapshot",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await fetch(`${backend_url}/snapshots`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
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
  }
);

export const fetchSnapshotDetails = createAsyncThunk(
  "selfScheduling/fetchSnapshotDetails",
  async (snapshotId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${backend_url}/snapshots/${snapshotId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Failed to fetch tour items");
      const data = await res.json();
      return { snapshotId, data: data };
    } catch (err) {
      return rejectWithValue({ snapshotId });
    }
  },
  {
    condition: (snapshotId, { getState }) => {
      const { snapshotsDetails } = getState().selfschedulingsDetails;
      const entry = snapshotsDetails[snapshotId];
      // if already loaded *or* currently loading, skip fetch
      return !(entry?.loaded || entry?.loading);
    },
  }
);

const selfschedulingDetailsSlice = createSlice({
  name: "selfschedulingsDetails",
  initialState: {
    selfscheduling: null,
    items: [],
    status: "idle",
    itemsStatus: "idle",
    slotsStatus: "idle",
    snapshotStatus: "idle",
    error: "",
    itemsError: "",
    slotsError: "",
    snapshotError: "",
    lastUpdatedId: null,
    snapshotsDetails: {},
    snapshots: [],
  },
  reducers: {
    updateAvailableSlots(state, action) {
      const { itemId, initialSlots, reserved, confirmed, createdOn } =
        action.payload;
      state.items = state.items.map((it) =>
        it.id === itemId
          ? {
              ...it,
              initialSlots,
              reserved,
              confirmed,
              updatedAt: createdOn || new Date().toISOString(),
            }
          : it
      );
      state.lastUpdatedId = itemId;
    },
    clearLastUpdatedId(state) {
      state.lastUpdatedId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSelfSchedulingDetails.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(fetchSelfSchedulingDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selfscheduling = action.payload;
        state.snapshots = action.payload.snapshots;
        action.payload.snapshots.forEach((s) => {
          state.snapshotsDetails[s.snapshotId] = {
            loading: false,
            loaded: false,
          };
        });
      })
      .addCase(fetchSelfSchedulingDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchTourItems.pending, (state) => {
        state.itemsStatus = "loading";
        state.itemsError = "";
      })
      .addCase(fetchTourItems.fulfilled, (state, action) => {
        state.itemsStatus = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchTourItems.rejected, (state, action) => {
        state.itemsStatus = "failed";
        state.itemsError = action.payload;
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
      .addCase(createSnapshot.pending, (state) => {
        state.snapshotStatus = "loading";
        state.snapshotError = "";
      })
      .addCase(createSnapshot.fulfilled, (state) => {
        state.snapshotStatus = "succeeded";
      })
      .addCase(createSnapshot.rejected, (state, action) => {
        state.snapshotStatus = "failed";
        state.snapshotError = action.payload;
      })
      .addCase(performConfigurationAction.fulfilled, (state, action) => {
        state.config = action.payload;
      })
      .addCase(fetchSnapshotDetails.pending, (state, { meta }) => {
        state.snapshotsDetails[meta.arg] = {
          loading: true,
          loaded: false,
          data: state.snapshotsDetails[meta.arg]?.data,
        };
      })
      .addCase(fetchSnapshotDetails.fulfilled, (state, { payload }) => {
        state.snapshotsDetails[payload.snapshotId] = {
          loading: false,
          loaded: true,
          data: payload.data,
        };
      })
      .addCase(fetchSnapshotDetails.rejected, (state, { meta }) => {
        state.snapshotsDetails[meta.arg] = {
          loading: false,
          loaded: false,
          data: undefined,
        };
      });
  },
});

export const { updateAvailableSlots, clearLastUpdatedId } =
  selfschedulingDetailsSlice.actions;
export default selfschedulingDetailsSlice.reducer;
