import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const getToken = () => localStorage.getItem("token") || "";
const backend_url = import.meta.env.REACT_APP_BACKEND_URL || "http://localhost:5005/api/v1";

export const fetchSelfschedulingDetails = createAsyncThunk(
  "selfschedulingDetails/fetchSelfschedulingDetails",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${backend_url}/selfschedulings/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Failed to fetch selfscheduling");
      const { selfScheduling, snapshot } = await res.json();
      return { selfscheduling: selfScheduling, snapshot };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const performSelfschedulingAction = createAsyncThunk(
  "selfschedulingDetails/performSelfschedulingAction",
  async ({ id, action }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${backend_url}/selfschedulings/${id}/${action}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Action failed");
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const generateSlots = createAsyncThunk(
  "selfschedulingDetails/generateSlots",
  async (selfSchedulingId, { rejectWithValue }) => {
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
  }
);

// export const createSnapshot = createAsyncThunk(
//   "selfschedulingDetails/createSnapshot",
//   async (payload, { rejectWithValue }) => {
//     try {
//       const res = await fetch(`${backend_url}/snapshots`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${getToken()}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });
//       if (!res.ok) {
//         const text = await res.text();
//         throw new Error(text || "Failed to create snapshot");
//       }
//       return true;
//     } catch (err) {
//       return rejectWithValue(err.message);
//     }
//   }
// );

export const activateSnapshot = createAsyncThunk(
  "selfschedulingDetails/activateSnapshot",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await fetch(`${backend_url}/selfschedulings/${payload.selfSchedulingId}/active-snapshot`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to activate snapshot");
      }
      return true;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const selfschedulingDetailsSlice = createSlice({
  name: "selfschedulingDetails",
  initialState: {
    selfscheduling: null,
    status: "idle",
    error: "",
  },
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(fetchSelfschedulingDetails.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(fetchSelfschedulingDetails.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.selfscheduling = payload.selfscheduling;
      })
      .addCase(fetchSelfschedulingDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(generateSlots.pending, (state) => {
        state.slotsStatus = "loading";
        state.slotsError = "";
      })
      .addCase(generateSlots.fulfilled, (state) => {
        state.slotsStatus = "succeeded";
      })
      .addCase(generateSlots.rejected, (state, action) => {
        state.slotsStatus = "failed";
        state.slotsError = action.payload;
      })
      // .addCase(createSnapshot.pending, (state) => {
      //   state.snapshotStatus = "loading";
      //   state.snapshotError = "";
      // })
      // .addCase(createSnapshot.fulfilled, (state) => {
      //   state.snapshotStatus = "succeeded";
      // })
      // .addCase(createSnapshot.rejected, (state, action) => {
      //   state.snapshotStatus = "failed";
      //   state.snapshotError = action.payload;
      // })
      .addCase(activateSnapshot.pending, (state) => {
        state.snapshotStatus = "loading";
        state.snapshotError = "";
      })
      .addCase(activateSnapshot.fulfilled, (state) => {
        state.snapshotStatus = "succeeded";
      })
      .addCase(activateSnapshot.rejected, (state, action) => {
        state.snapshotStatus = "failed";
        state.snapshotError = action.payload;
      })
      .addCase(performSelfschedulingAction.fulfilled, (state, { payload }) => {
        state.config = payload;
      }),
  // .addCase(fetchSnapshotDetails.pending, (state, { meta }) => {
  //   state.snapshotsDetails[meta.arg] = {
  //     loading: true,
  //     loaded: false,
  //     data: state.snapshotsDetails[meta.arg]?.data,
  //   };
  // })
  // .addCase(fetchSnapshotDetails.fulfilled, (state, { payload }) => {
  //   state.snapshotsDetails[payload.snapshotId] = {
  //     loading: false,
  //     loaded: true,
  //     data: payload.data,
  //   };
  // })
  // .addCase(fetchSnapshotDetails.rejected, (state, { meta }) => {
  //   state.snapshotsDetails[meta.arg] = {
  //     loading: false,
  //     loaded: false,
  //     data: undefined,
  //   };
  // }),
});
export default selfschedulingDetailsSlice.reducer;
