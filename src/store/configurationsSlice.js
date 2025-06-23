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
  async (date, { dispatch, rejectWithValue }) => {
    try {
      await fetch(`http://localhost:5005/configurations/open?date=${date}`, {
        method: "POST",
      });
      dispatch(fetchConfigurations({ pageSize: 10, pageNumber: 1, cityId: 1 }));
      return date;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const closeConfiguration = createAsyncThunk(
  "configurations/closeConfiguration",
  async (date, { dispatch, rejectWithValue }) => {
    try {
      await fetch(`http://localhost:5005/configurations/close?date=${date}`, {
        method: "POST",
      });
      dispatch(fetchConfigurations({ pageSize: 10, pageNumber: 1, cityId: 1 }));
      return date;
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
      .addCase(openConfiguration.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(openConfiguration.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(closeConfiguration.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(closeConfiguration.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});
const getToken = () => localStorage.getItem("token") || "";
export default configurationsSlice.reducer;
