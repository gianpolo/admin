import { useSelector } from "react-redux";

export default function NotificationStatusIcon() {
  const status = useSelector((state) => state.notifications.status);

  let color = "bg-gray-400";
  if (status === "connected") color = "bg-green-500";
  else if (status === "connecting") color = "bg-yellow-500";
  else if (status === "failed") color = "bg-red-500";

  return (
    <span
      className={`ml-1 inline-block h-3 w-3 rounded-full ${color} border border-white dark:border-gray-800`}
      title={`Notifications ${status}`}
    />
  );
}
