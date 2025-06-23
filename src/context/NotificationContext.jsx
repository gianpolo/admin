import { createContext, useContext, useEffect, useRef } from "react";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { useAuth } from "./AuthContext.jsx";

const backend_url = import.meta.env.REACT_APP_BACKEND_URL || "/api";
const hubUrl = backend_url.replace(/\/api\/v1\/?$/, "") + "/hubs/notifications";

const NotificationContext = createContext(undefined);

export const NotificationProvider = ({ children }) => {
  const { token } = useAuth();
  const connectionRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    const connection = new HubConnectionBuilder()
      .withUrl(hubUrl, { accessTokenFactory: () => token })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build();

    connectionRef.current = connection;
    connection.start().catch((err) => console.error("SignalR start error", err));

    return () => {
      connection.stop();
    };
  }, [token]);

  const onAvailableSlotsUpdated = (handler) => {
    if (connectionRef.current) {
      connectionRef.current.on("AvailableSlotsUpdated", handler);
    }
  };

  const offAvailableSlotsUpdated = (handler) => {
    if (connectionRef.current) {
      connectionRef.current.off("AvailableSlotsUpdated", handler);
    }
  };

  return (
    <NotificationContext.Provider value={{ onAvailableSlotsUpdated, offAvailableSlotsUpdated }}>
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
