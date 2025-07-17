import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const generateSlots = createAsyncThunk("slots/generateSlots", async (selfSchedulingId, { rejectWithValue }) => {
  try {
    const res = await fetch(`${backend_url}/snapshots/slots/${selfSchedulingId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Failed to generate slots");
    }
    return true;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const slotsSlice = createSlice({
  name: "slots",
  initialState: { status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(generateSlots.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(generateSlots.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(generateSlots.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default slotsSlice.reducer;
