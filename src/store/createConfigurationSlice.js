import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const getToken = () => localStorage.getItem("token") || "";
const backend_url = import.meta.env.REACT_APP_BACKEND_URL || "/api";

export const fetchCities = createAsyncThunk(
  "configForm/fetchCities",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${backend_url}/cities`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Failed to fetch cities");
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchExperiences = createAsyncThunk(
  "configForm/fetchExperiences",
  async ({ cityName }, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${backend_url}/tours?cityName=${encodeURIComponent(cityName)}&pageSize=20&pageNumber=1`,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      if (!res.ok) throw new Error("Failed to fetch experiences");
      const data = await res.json();
      return data.items || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchGuides = createAsyncThunk(
  "configForm/fetchGuides",
  async ({ cityId }, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${backend_url}/guides?cityId=${cityId}&pageSize=20&pageNumber=1`,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      if (!res.ok) throw new Error("Failed to fetch guides");
      const data = await res.json();
      return data.items || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createConfiguration = createAsyncThunk(
  "configForm/createConfiguration",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await fetch(`${backend_url}/configuration`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to create configuration");
      }
      return true;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const createConfigurationSlice = createSlice({
  name: "configForm",
  initialState: {
    cities: [],
    experiences: [],
    guides: [],
    status: "idle",
    error: "",
    createStatus: "idle",
    createError: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.cities = action.payload;
      })
      .addCase(fetchExperiences.fulfilled, (state, action) => {
        state.experiences = action.payload;
      })
      .addCase(fetchGuides.fulfilled, (state, action) => {
        state.guides = action.payload;
      })
      .addCase(createConfiguration.pending, (state) => {
        state.createStatus = "loading";
        state.createError = "";
      })
      .addCase(createConfiguration.fulfilled, (state) => {
        state.createStatus = "succeeded";
      })
      .addCase(createConfiguration.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = action.payload;
      });
  },
});

export default createConfigurationSlice.reducer;
