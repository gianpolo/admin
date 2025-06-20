import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchConfigurations = createAsyncThunk(
  "configurations/fetchConfigurations",
  async ({ pageSize = 10, pageNumber = 1, cityId } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (pageSize) params.append("pageSize", pageSize);
      if (pageNumber) params.append("pageNumber", pageNumber);
      if (cityId !== undefined) params.append("cityId", cityId);
      const response = await fetch(
        `http://localhost:5005/api/v1/configuration/configurations?${params.toString()}`,
        {
          headers: {
            Authorization: "Bearer token",
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
      });
  },
});

export default configurationsSlice.reducer;
