import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  HubConnectionBuilder,
  LogLevel,
  HttpTransportType,
} from "@microsoft/signalr";
import { updateAvailableSlots } from "./configurationDetailsSlice.js";

let connection = null;

export const startNotifications = createAsyncThunk(
  "notifications/start",
  async (_, { getState, dispatch, rejectWithValue }) => {
    const { token } = getState().auth;
    if (!token) return rejectWithValue("No auth token");
    const backendUrl =
      import.meta.env.VITE_BACKEND_URL || "http://localhost:5010";
    const hubUrl = backendUrl.replace(/\/api\/v1\/?$/, "") + "/hubs/notifications";
    try {
      connection = new HubConnectionBuilder()
        .withUrl(hubUrl, {
          accessTokenFactory: () => token,
          withCredentials: false,
          skipNegotiation: true,
          transport: HttpTransportType.WebSockets,
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Warning)
        .build();

      connection.on("TourItemAvailabilityUpdatedEvent", (payload) => {
        dispatch(updateAvailableSlots(payload));
      });

      await connection.start();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const stopNotifications = createAsyncThunk(
  "notifications/stop",
  async () => {
    if (connection) {
      await connection.stop();
      connection = null;
    }
  }
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: { status: "idle" },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(startNotifications.pending, (state) => {
        state.status = "connecting";
      })
      .addCase(startNotifications.fulfilled, (state) => {
        state.status = "connected";
      })
      .addCase(startNotifications.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(stopNotifications.fulfilled, (state) => {
        state.status = "idle";
      });
  },
});

export default notificationsSlice.reducer;
