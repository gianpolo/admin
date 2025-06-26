import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const getToken = () => localStorage.getItem("token") || "";
const backend_url =
  import.meta.env.REACT_APP_BACKEND_URL || "http://localhost:5005/api/v1";

export const fetchConfigurationDetails = createAsyncThunk(
  "configDetails/fetchConfigurationDetails",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${backend_url}/configurations/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Failed to fetch configuration");
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchConfigurationItems = createAsyncThunk(
  "configDetails/fetchConfigurationItems",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${backend_url}/items?configurationId=${id}`, {
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
  "configDetails/performConfigurationAction",
  async ({ id, action }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${backend_url}/configurations/${id}/${action}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Action failed");
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const configurationDetailsSlice = createSlice({
  name: "configDetails",
  initialState: {
    config: null,
    items: [],
    status: "idle",
    itemsStatus: "idle",
    error: "",
    itemsError: "",
    lastUpdatedId: null,
  },
  reducers: {
    updateAvailableSlots(state, action) {
      const {
        itemId,
        initialSlots,
        reserved,
        confirmed,
        createdOn,
      } = action.payload;
        it.id === itemId
          ? {
              ...it,
              initialSlots,
              reserved,
              confirmed,
              updatedAt: createdOn || new Date().toISOString(),
            }
          : it;
      state.items = state.items.map((it) =>
        it.id === itemId
          ? {
              ...it,
              initialSlots,
              reserved,
              confirmed,
              updatedAt: updatedAt || new Date().toISOString(),
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
      .addCase(fetchConfigurationDetails.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(fetchConfigurationDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.config = action.payload;
      })
      .addCase(fetchConfigurationDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchConfigurationItems.pending, (state) => {
        state.itemsStatus = "loading";
        state.itemsError = "";
      })
      .addCase(fetchConfigurationItems.fulfilled, (state, action) => {
        state.itemsStatus = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchConfigurationItems.rejected, (state, action) => {
        state.itemsStatus = "failed";
        state.itemsError = action.payload;
      })
      .addCase(performConfigurationAction.fulfilled, (state, action) => {
        state.config = action.payload;
      });
  },
});

export const { updateAvailableSlots, clearLastUpdatedId } =
  configurationDetailsSlice.actions;
export default configurationDetailsSlice.reducer;
