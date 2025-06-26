import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  HubConnectionBuilder,
  LogLevel,
  HttpTransportType,
} from "@microsoft/signalr";
import { updateAvailableSlots } from "./configurationDetailsSlice.js";

let connection = null;

// Small helper slice to keep a list of incoming notifications

export const startNotifications = createAsyncThunk(
  "notifications/start",
  async (_, { getState, dispatch, rejectWithValue }) => {
    const { token } = getState().auth;
    if (!token) return rejectWithValue("No auth token");
    const backendUrl =
      import.meta.env.VITE_BACKEND_URL || "http://localhost:5010";
    const hubUrl =
      backendUrl.replace(/\/api\/v1\/?$/, "") + "/hubs/notifications";
    try {
      console.log("Connecting to notifications hub:", hubUrl);
      connection = new HubConnectionBuilder()
        .withUrl(hubUrl, {
          accessTokenFactory: () => token,
          withCredentials: false,
          skipNegotiation: true,
          transport: HttpTransportType.WebSockets,
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();

      connection.on("TourItemAvailabilityUpdatedEvent", (payload) => {
        dispatch(updateAvailableSlots(payload));
      });

      connection.on("ConfigurationCreatedEvent", (payload) => {
        console.log("ConfigurationCreatedEvent", payload);
        dispatch(addNotification(payload));
      });

      connection.on("ConfigurationOpenedEvent", (payload) => {
        console.log("ConfigurationOpenedEvent", payload);
        dispatch(addNotification(payload));
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
  initialState: { status: "idle", items: [] },
  reducers: {
    addNotification(state, action) {
      state.items.unshift(action.payload);
    },
    clearNotifications(state) {
      state.items = [];
    },
  },
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

export const { addNotification, clearNotifications } =
  notificationsSlice.actions;

export default notificationsSlice.reducer;
