import { useSelector, useDispatch } from "react-redux";
import ComponentCard from "../common/ComponentCard.jsx";
import { clearNotifications } from "../../store/notificationsSlice.js";

export default function NotificationsWidget() {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications.items);

  const handleClear = () => {
    dispatch(clearNotifications());
  };

  return (
    <ComponentCard title="Notifications">
      {notifications.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">No notifications</p>
      ) : (
        <>
          <div className="flex justify-end">
            <button
              onClick={handleClear}
              className="text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              Clear All
            </button>
          </div>
          <ul className="flex flex-col max-h-96 overflow-y-auto custom-scrollbar divide-y divide-gray-100 dark:divide-gray-800">
            {notifications.map((n, idx) => (
              <li key={n.ConfigurationId ?? idx} className="py-2">
                <p className="font-medium text-gray-800 dark:text-white/90">
                  {n.EventType === "ConfigurationCreatedEvent"
                    ? "A configuration was created"
                    : n.EventType === "ConfigurationOpenedEvent"
                    ? "A configuration was opened"
                    : n.EventType}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(n.CreatedOn).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {n.Description || "No description available."}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
    </ComponentCard>
  );
}
