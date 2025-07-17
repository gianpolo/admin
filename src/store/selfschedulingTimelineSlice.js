import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchTimelineEvents = createAsyncThunk(
  "selfSchedulingTimeline/fetchTimelineEvents",
  async (selfSchedulingId, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/selfschedulings/${selfSchedulingId}/events`);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to fetch timeline events");
      }
      const data = await res.json();
      // sort ascending by timestamp
      data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  events: [],
  loading: false,
  error: null,
};

const selfSchedulingTimelineSlice = createSlice({
  name: "selfSchedulingTimeline",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTimelineEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.events = [];
      })
      .addCase(fetchTimelineEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchTimelineEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default selfSchedulingTimelineSlice.reducer;
