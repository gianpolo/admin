import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchConfigurations = createAsyncThunk(
  "configurations/fetchConfigurations",
  async ({ pageSize = 10, pageNumber = 1, cityId } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (pageSize) params.append("pageSize", pageSize);
      if (pageNumber) params.append("pageNumber", pageNumber);
      if (cityId !== undefined) params.append("cityId", cityId);
      const token = getToken();
      const backend_url = import.meta.env.REACT_APP_BACKEND_URL || "http://localhost:5005/api/v1";
      const response = await fetch(
        `${backend_url}/configurations?${params.toString()}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch configurations");
      }
      return await response.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const openConfiguration = createAsyncThunk(
  "configurations/openConfiguration",
  async ({ id }, { rejectWithValue }) => {
    try {
      const token = getToken();
      const backend_url = import.meta.env.REACT_APP_BACKEND_URL || "http://localhost:5005/api/v1";
      const url = `${backend_url}/configurations/${id}/open`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error("Failed to open configuration");
      }
      return { id };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const closeConfiguration = createAsyncThunk(
  "configurations/closeConfiguration",
  async ({ id }, { rejectWithValue }) => {
    try {
      const token = getToken();
      const backend_url = import.meta.env.REACT_APP_BACKEND_URL || "http://localhost:5005/api/v1";
      const url = `${backend_url}/configurations/${id}/close`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error("Failed to close configuration");
      }
      return { id };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const simulateConfiguration = createAsyncThunk(
  "configurations/simulateConfiguration",
  async ({ guideIds = [] }, { rejectWithValue }) => {
    try {
      const body = guideIds.map((guideId) => ({
        guideId,
        guideName: `Guide ${guideId}`,
      }));
      const res = await fetch("http://localhost:5006/virtualguides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        throw new Error("Failed to start simulation");
      }
      const data = await res.json().catch(() => ({}));
      return data.message || "Simulation started";
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const configurationsSlice = createSlice({
  name: "configurations",
  initialState: {
    list: [],
    status: "idle",
    error: null,
    actionStatus: {},
    simulationStatus: "idle",
    simulationMessage: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchConfigurations.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchConfigurations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload || [];
      })
      .addCase(fetchConfigurations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(openConfiguration.pending, (state, action) => {
        state.actionStatus[action.meta.arg.id] = "loading";
      })
      .addCase(openConfiguration.fulfilled, (state, action) => {
        const cfg = state.list.find((c) => c.id === action.payload.id);
        if (cfg) cfg.isRunning = true;
        state.actionStatus[action.payload.id] = "idle";
      })
      .addCase(openConfiguration.rejected, (state, action) => {
        state.actionStatus[action.meta.arg.id] = "idle";
      })
      .addCase(closeConfiguration.pending, (state, action) => {
        state.actionStatus[action.meta.arg.id] = "loading";
      })
      .addCase(closeConfiguration.fulfilled, (state, action) => {
        const cfg = state.list.find((c) => c.id === action.payload.id);
        if (cfg) cfg.isRunning = false;
        state.actionStatus[action.payload.id] = "idle";
      })
      .addCase(closeConfiguration.rejected, (state, action) => {
        state.actionStatus[action.meta.arg.id] = "idle";
      })
      .addCase(simulateConfiguration.pending, (state) => {
        state.simulationStatus = "loading";
        state.simulationMessage = "";
      })
      .addCase(simulateConfiguration.fulfilled, (state, action) => {
        state.simulationStatus = "succeeded";
        state.simulationMessage = action.payload;
      })
      .addCase(simulateConfiguration.rejected, (state, action) => {
        state.simulationStatus = "failed";
        state.simulationMessage = action.payload;
      });
  },
});
const getToken = () => localStorage.getItem("token") || "";
export default configurationsSlice.reducer;

