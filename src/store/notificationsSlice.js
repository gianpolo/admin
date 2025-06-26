import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  HubConnectionBuilder,
  LogLevel,
  HttpTransportType,
} from "@microsoft/signalr";
import { updateAvailableSlots } from "./configurationDetailsSlice.js";

let connection = null;
const getToken = () => localStorage.getItem("token") || "";
const backend_url =
  import.meta.env.REACT_APP_BACKEND_URL || "http://localhost:5005/api/v1";
// Small helper slice to keep a list of incoming notifications
export const fetchEventsLogs = createAsyncThunk(
  "notifications/fetchEventsLog",
  async (id, { rejectWithValue }) => {
    console.log("fetching logs");
    try {
      const res = await fetch(`${backend_url}/logs?id=${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Failed to fetch logs");
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
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

      connection.on("BasketItemAddedEvent", (payload) => {
        console.log("BasketItemAddedEvent", payload);
        dispatch(addNotification(payload));
      });
      connection.on("BasketItemRemovedEvent", (payload) => {
        console.log("BasketItemRemovedEvent", payload);
        dispatch(addNotification(payload));
      });
      connection.on("BasketItemExpiredEvent", (payload) => {
        console.log("BasketItemExpiredEvent", payload);
        dispatch(addNotification(payload));
      });
      connection.on("BasketConfirmedEvent", (payload) => {
        console.log("BasketConfirmedEvent", payload);
        dispatch(addNotification(payload));
      });
      connection.on("AddBasketItemFailedEvent", (payload) => {
        console.log("AddBasketItemFailedEvent", payload);
        dispatch(addNotification(payload));
      });
      connection.on("TourItemAvailabilityUpdatedEvent", (payload) => {
        console.log("TourItemAvailabilityUpdatedEvent", payload);
        dispatch(updateAvailableSlots(payload));
        dispatch(addNotification(payload));
      });
      connection.on("TourItemReservationFailureEvent", (payload) => {
        console.log("TourItemReservationFailureEvent", payload);
        dispatch(addNotification(payload));
      });
      connection.on("TourItemCreatedEvent", (payload) => {
        console.log("TourItemCreatedEvent", payload);
        dispatch(addNotification(payload));
      });
      connection.on("ConfigurationCreatedEvent", (payload) => {
        console.log("ConfigurationCreatedEvent", payload);
        dispatch(addNotification(payload));
      });

      connection.on("ConfigurationOpenedEvent", (payload) => {
        console.log("ConfigurationOpenedEvent", payload);
        dispatch(addNotification(payload));
      });

      connection.on("ConfigurationClosedEvent", (payload) => {
        console.log("ConfigurationClosedEvent", payload);
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
      .addCase(fetchEventsLogs.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchEventsLogs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload || [];
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
