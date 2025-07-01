import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  HubConnectionBuilder,
  LogLevel,
  HttpTransportType,
} from "@microsoft/signalr";
import { updateAvailableSlots } from "./configurationDetailsSlice.js";

let connection = null;
const getToken = () => localStorage.getItem("token") || "";
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5010";
const logsUrl = `${backendUrl}/api/v1/logs/configuration`;

export const fetchEventsLogs = createAsyncThunk(
  "notifications/fetchEventsLog",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${logsUrl}/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Failed to fetch logs");
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const registerEventHandlers = (connection, dispatch) => {
  const simpleEvents = [
    "BasketItemAddedIntegrationEvent",
    "BasketItemRemovedIntegrationEvent",
    "BasketItemExpiredIntegrationEvent",
    "BasketConfirmedIntegrationEvent",
    "AddBasketItemFailureIntegrationEvent",
    "TourItemCreatedIntegrationEvent",
    "ConfigurationSlotsGenerationRequestedIntegrationEvent",
    "ConfigurationSlotsGeneratedIntegrationEvent",
    "ConfigurationOpenedIntegrationEvent",
    "ConfigurationClosedIntegrationEvent",
    "ConfigurationCreatedIntegrationEvent",
  ];

  const slotEvents = [
    "SlotReservedIntegrationEvent",
    "SlotReleasedIntegrationEvent",
    "SlotConfirmedIntegrationEvent",
    "SlotReservationFailureIntegrationEvent",
  ];

  simpleEvents.forEach((event) =>
    connection.on(event, (payload) => {
      console.log(event, payload);
      dispatch(addNotification(payload));
    })
  );

  slotEvents.forEach((event) =>
    connection.on(event, (payload) => {
      console.log(event, payload);
      dispatch(updateAvailableSlots(payload));
      dispatch(addNotification(payload));
    })
  );
};

export const startNotifications = createAsyncThunk(
  "notifications/start",
  async (_, { getState, dispatch, rejectWithValue }) => {
    const { token } = getState().auth;
    if (!token) return rejectWithValue("No auth token");

    const hubUrl =
      backendUrl.replace(/\/api\/v1\/?$/, "") + "/hubs/notifications";

    try {
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

      registerEventHandlers(connection, dispatch);

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
  initialState: { status: "idle", items: [], error: null, logs: [] },
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
      .addCase(fetchEventsLogs.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchEventsLogs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.logs = action.payload || [];
      })
      .addCase(fetchEventsLogs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(startNotifications.pending, (state) => {
        state.status = "connecting";
      })
      .addCase(startNotifications.fulfilled, (state) => {
        state.status = "connected";
      })
      .addCase(startNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(stopNotifications.fulfilled, (state) => {
        state.status = "idle";
      });
  },
});

export const { addNotification, clearNotifications } =
  notificationsSlice.actions;
export default notificationsSlice.reducer;
