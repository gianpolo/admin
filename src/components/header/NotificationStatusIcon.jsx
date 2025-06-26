import { useSelector } from "react-redux";
import { ConnectionIcon } from "../../icons";
export default function NotificationStatusIcon() {
  const status = useSelector((state) => state.notifications.status);

  let color = "bg-gray-400";
  let textColor = "text-gray-500";
  let borderColor = "border-gray-400";
  let hoverColor = "hover:bg-red-500";
  if (status === "connected") color = "bg-green-500";
  else if (status === "connecting") color = "bg-yellow-500";
  else if (status === "failed") {
    color = "bg-red-500";
    hoverColor = "bg-green-700";
    textColor = "text-white";
    borderColor = "border-red-500";
  }

  return (
    <button
      className={`relative flex items-center justify-center ${textColor} transition-colors ${color} border ${borderColor} rounded-full dropdown-toggle hover:text-gray-200 h-11 w-11 hover:${hoverColor} dark:border-gray-800 dark:${color} dark:${textColor} dark:hover:${borderColor}  dark:hover:text-white`}
    >
      <ConnectionIcon className="fill-current" />
    </button>
  );
}
