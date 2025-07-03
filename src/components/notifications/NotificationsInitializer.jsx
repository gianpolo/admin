import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  startNotifications,
  stopNotifications,
} from "../../store/notificationsSlice.js";

export default function NotificationsInitializer() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) {
      dispatch(startNotifications());
    }

    return () => {
      dispatch(stopNotifications());
    };
  }, [dispatch, token]);

  return null;
}
