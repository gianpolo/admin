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

const configurationsSlice = createSlice({
  name: "configurations",
  initialState: {
    list: [],
    status: "idle",
    error: null,
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
      .addCase(openConfiguration.fulfilled, (state, action) => {
        const cfg = state.list.find((c) => c.id === action.payload.id);
        if (cfg) cfg.isRunning = true;
      })
      .addCase(closeConfiguration.fulfilled, (state, action) => {
        const cfg = state.list.find((c) => c.id === action.payload.id);
        if (cfg) cfg.isRunning = false;
      });
  },
});
const getToken = () => localStorage.getItem("token") || "";
export default configurationsSlice.reducer;

