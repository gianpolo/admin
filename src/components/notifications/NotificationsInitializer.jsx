import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  startNotifications,
  stopNotifications,
} from "../../store/notificationsSlice.js";

export default function NotificationsInitializer() {
  console.log("NotificationsInitializer");
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) {
      console.log("Starting notifications with token:", token);
      dispatch(startNotifications());
    }

    return () => {
      console.log("Cleaning up notifications");
      dispatch(stopNotifications());
    };
  }, [dispatch, token]);

  return null;
}
