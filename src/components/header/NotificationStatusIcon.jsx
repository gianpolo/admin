import { useSelector } from "react-redux";
import { ConnectionIcon } from "../../icons";
export default function NotificationStatusIcon() {
  const status = useSelector((state) => state.notifications.status);

  let color = "bg-gray-400";
  let textColor = "text-gray-500";
  let borderColor = "border-green-700";
  let hoverColor = "hover:bg-red-500";
  if (status === "connected") {
    color = "bg-green-400";
    textColor = "text-white";
  } else if (status === "connecting") color = "bg-yellow-500";
  else if (status === "failed") {
    color = "bg-red-500";
    hoverColor = "bg-green-700";
    textColor = "text-white";
    borderColor = "border-red-500";
  }
  const handleClick = (event) => {
    event.stopPropagation();
    //force connection
  }
  return (
    <button
      className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full dropdown-toggle hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
      onClick={handleClick}
    >
      <span
        className={`absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-green-400`}
      >
        <span className={`absolute inline-flex w-full h-full ${color} rounded-full opacity-75 animate-ping`}></span>
      </span>
      <ConnectionIcon className="fill-current" />
    </button>
  );
  
}
