import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchSelfSchedulings = createAsyncThunk(
  "selfschedulings/fetchSelfSchedulings",
  async (
    { pageSize = 10, pageNumber = 1, cityId } = {},
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams();
      if (pageSize) params.append("pageSize", pageSize);
      if (pageNumber) params.append("pageNumber", pageNumber);
      if (cityId !== undefined) params.append("cityId", cityId);
      const token = getToken();
      const backend_url =
        import.meta.env.REACT_APP_BACKEND_URL || "http://localhost:5005/api/v1";
      const response = await fetch(
        `${backend_url}/selfschedulings?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch selfschedulings");
      }
      return await response.json();
    } catch (err) {
      console.error("Error fetching selfschedulings:", err);
      return rejectWithValue(err.message);
    }
  }
);

export const openConfiguration = createAsyncThunk(
  "selfschedulings/openConfiguration",
  async ({ id }, { rejectWithValue }) => {
    try {
      const token = getToken();
      const backend_url =
        import.meta.env.REACT_APP_BACKEND_URL || "http://localhost:5005/api/v1";
      const url = `${backend_url}/selfschedulings/${id}/open`;
      const res = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
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
  "selfschedulings/closeConfiguration",
  async ({ id }, { rejectWithValue }) => {
    try {
      const token = getToken();
      const backend_url =
        import.meta.env.REACT_APP_BACKEND_URL || "http://localhost:5005/api/v1";
      const url = `${backend_url}/selfschedulings/${id}/close`;

      const res = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
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

export const deleteConfiguration = createAsyncThunk(
  "selfschedulings/deleteConfiguration",
  async ({ id }, { rejectWithValue }) => {
    try {
      const token = getToken();
      const backend_url =
        import.meta.env.REACT_APP_BACKEND_URL || "http://localhost:5005/api/v1";
      const url = `${backend_url}/selfschedulings/${id}`;
      const res = await fetch(url, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error("Failed to delete configuration");
      }
      return { id };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const checkSimulation = createAsyncThunk(
  "selfschedulings/checkSimulation",
  async ({ id }, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:5009/virtualguides/${id}`);

      if (res.status === 404) return false;
      if (!res.ok) throw new Error("Failed to fetch simulation status");
      var started = await res.json();
      return !!started;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const startSimulation = createAsyncThunk(
  "selfschedulings/startSimulation",
  async ({ id }, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `http://localhost:5009/virtualguides/${id}/start`,
        {
          method: "POST",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to start simulation");
      }
      return true;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const stopSimulation = createAsyncThunk(
  "selfschedulings/stopSimulation",
  async ({ id }, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `http://localhost:5009/virtualguides/${id}/stop`,
        {
          method: "POST",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to stop simulation");
      }
      return true;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const selfschedulingsSlice = createSlice({
  name: "configurations",
  initialState: {
    list: [],
    status: "idle",
    error: null,
    actionStatus: {},
    simulationStatus: "idle",
    simulationMessage: "",
    isSimulationRunning: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSelfSchedulings.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSelfSchedulings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload || [];
      })
      .addCase(fetchSelfSchedulings.rejected, (state, action) => {
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
      .addCase(deleteConfiguration.pending, (state, action) => {
        state.actionStatus[action.meta.arg.id] = "loading";
      })
      .addCase(deleteConfiguration.fulfilled, (state, action) => {
        state.list = state.list.filter((c) => c.id !== action.payload.id);
        delete state.actionStatus[action.payload.id];
      })
      .addCase(deleteConfiguration.rejected, (state, action) => {
        state.actionStatus[action.meta.arg.id] = "idle";
      })
      .addCase(startSimulation.pending, (state) => {
        state.simulationStatus = "loading";
        state.simulationMessage = "";
      })
      .addCase(startSimulation.fulfilled, (state, action) => {
        state.simulationStatus = "succeeded";
        state.simulationMessage = action.payload;
        state.isSimulationRunning = true;
      })
      .addCase(startSimulation.rejected, (state, action) => {
        state.simulationStatus = "failed";
        state.simulationMessage = action.payload;
      })
      .addCase(stopSimulation.pending, (state) => {
        state.simulationStatus = "loading";
        state.simulationMessage = "";
      })
      .addCase(stopSimulation.fulfilled, (state, action) => {
        state.simulationStatus = "succeeded";
        state.simulationMessage = action.payload;
        state.isSimulationRunning = false;
      })
      .addCase(stopSimulation.rejected, (state, action) => {
        state.simulationStatus = "failed";
        state.simulationMessage = action.payload;
      })
      .addCase(checkSimulation.fulfilled, (state, action) => {
        state.isSimulationRunning = action.payload;
      });
  },
});
const getToken = () => localStorage.getItem("token") || "";
export default selfschedulingsSlice.reducer;
