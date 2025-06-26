import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const getToken = () => localStorage.getItem("token") || "";
const backend_url =
  import.meta.env.REACT_APP_BACKEND_URL || "http://localhost:5005/api/v1";

export const fetchItemDetails = createAsyncThunk(
  "items/fetchItemDetails",
  async (id, { rejectWithValue }) => {
    try {
      const headers = { Authorization: `Bearer ${getToken()}` };
      const [itemRes, slotRes] = await Promise.all([
        fetch(`${backend_url}/items/${id}`, { headers }),
        fetch(`${backend_url}/items/slotinfo/${id}`, { headers }),
      ]);
      if (!itemRes.ok) throw new Error("Failed to fetch item");
      if (!slotRes.ok) throw new Error("Failed to fetch slot info");
      const itemData = await itemRes.json();
      const slotData = await slotRes.json();
      return {
        ...itemData,
        availableSlots: slotData.initialAvailability,
        reservedSlots: slotData.reservedSlots,
        confirmedSlots: slotData.confirmedSlots,
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const itemsSlice = createSlice({
  name: "items",
  initialState: { item: null, status: "idle", error: "" },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItemDetails.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(fetchItemDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.item = action.payload;
      })
      .addCase(fetchItemDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default itemsSlice.reducer;
