import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const getToken = () => localStorage.getItem("token") || "";
const backend_url = import.meta.env.REACT_APP_BACKEND_URL || "http://localhost:5005/api/v1";

export const fetchCities = createAsyncThunk("schedulingPlanForm/fetchCities", async (_, { rejectWithValue }) => {
  try {
    const res = await fetch(`${backend_url}/cities`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error("Failed to fetch cities");
    return await res.json();
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchExperiences = createAsyncThunk(
  "schedulingPlanForm/fetchExperiences",
  async ({ cityName }, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${backend_url}/tours?cityName=${encodeURIComponent(cityName)}&pageSize=20&pageNumber=1`,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      if (!res.ok) throw new Error("Failed to fetch experiences");
      const data = await res.json();
      return data || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchGuides = createAsyncThunk(
  "schedulingPlanForm/fetchGuides",
  async ({ cityId, experienceIds = [], allocationPeriod, pageSize = 20, pageNumber = 1 }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (pageSize) params.append("pageSize", pageSize);
      if (pageNumber) params.append("pageNumber", pageNumber);
      if (cityId !== undefined) params.append("cityId", cityId);
      experienceIds.forEach((id) => params.append("experienceIds", id));
      if (allocationPeriod?.start && allocationPeriod?.end) {
        params.append("allocationPeriod.start", allocationPeriod.start);
        params.append("allocationPeriod.end", allocationPeriod.end);
      }
      const res = await fetch(`${backend_url}/guides?${params.toString()}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Failed to fetch guides");
      const data = await res.json();
      return data || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createSchedulingSession = createAsyncThunk(
  "schedulingPlanForm/createSchedulingSession",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await fetch(`${backend_url}/schedulingplans`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const text = await res.text();
      if (!res.ok) {
        throw new Error(text || "Failed to create scheduling session");
      }
      try {
        return text ? JSON.parse(text) : true;
      } catch (e) {
        return true;
      }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const schedulingPlanFormSlice = createSlice({
  name: "schedulingPlanForm",
  initialState: {
    cities: null,
    experiences: null,
    guides: null,
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
      .addCase(createSchedulingSession.pending, (state) => {
        state.createStatus = "loading";
        state.createError = "";
      })
      .addCase(createSchedulingSession.fulfilled, (state) => {
        state.createStatus = "succeeded";
      })
      .addCase(createSchedulingSession.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = action.payload;
      });
  },
});

export default schedulingPlanFormSlice.reducer;
