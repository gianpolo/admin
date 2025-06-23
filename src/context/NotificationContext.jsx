import { createContext, useContext, useEffect, useRef } from "react";
import { HubConnectionBuilder, LogLevel, HttpTransportType } from "@microsoft/signalr";
import { useAuth } from "./AuthContext.jsx";
const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://localhost:31782";
const hubUrl = backendUrl.replace(/\/api\/v1\/?$/, "") + "/hubs/notifications";
const NotificationContext = createContext(undefined);

export const NotificationProvider = ({ children }) => {
  const { token } = useAuth();
  const connectionRef = useRef(null);
  useEffect(() => {
    if (!token) return;

    const connection = new HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => token,
        withCredentials: false,
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    connectionRef.current = connection;

    let cancelled = false;

    const connect = async () => {
      try {
        await connection.start();
        if (!cancelled) {
          console.log("✅ SignalR connection started");
        } else {
          console.warn("🟡 Connection started after cancellation. Stopping...");
          await connection.stop(); // cleanup if unmounted during start
        }
      } catch (err) {
        if (!cancelled) {
          console.error("❌ SignalR start error", err);
        }
      }
    };

    connect();

    return () => {
      cancelled = true;
      if (connection.state === "Connected" || connection.state === "Connecting") {
        connection.stop().catch(() => { });
      }
    };
  }, [token]);
 

  const onBasketItemAdded = (handler) => { 
    connectionRef.current?.on("BasketItemAdded", handler);
  };

  const offBasketItemAdded = (handler) => {
    connectionRef.current?.off("BasketItemAdded", handler);
  };

  const onItemAvailabilityUpdateIntegrationEvent = (handler) => {
    connectionRef.current?.on("BasketItemAdded", handler);
  }

  return (
    <NotificationContext.Provider value={{ onBasketItemAdded, offBasketItemAdded }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return ctx;
};
