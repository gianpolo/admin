import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router";
import ComponentCard from "../common/ComponentCard.jsx";
import { eventsData } from "../../utils/constants.js";
import { Table, TableBody, TableCell, TableRow } from "../ui/table/index.jsx";
import { fetchEventsLogs } from "../../store/notificationsSlice.js";
export default function NotificationsWidget() {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications.items);
  const { id } = useParams();
  useEffect(() => {
    dispatch(fetchEventsLogs(id));
  }, [id]);

  // const filtered = notifications.filter((n) => {
  //   const configId = n.content.configurationId;
  //   console.log(String(configId));
  //   console.log(String(id));
  //   var res = configId === id;
  //   console.log(res);

  //   return res;
  // });

  const handleClear = () => {
    dispatch(clearNotifications());
  };

  return (
    <ComponentCard title="Events log">
      {notifications.length === 0 ? (
        <p className=" text-sm text-gray-500 dark:text-gray-400">
          No notifications
        </p>
      ) : (
        <>
          <Table>
            <TableBody className="overflow-y-auto">
              {notifications.map((n, idx) => {
                return (
                  <TableRow className="text-[10px]" key={n.createdOn}>
                    <TableCell className="px-2 py-2 sm:px-2 text-start ">
                      <div className="flex items-center gap-3">
                        <span
                          className={`mr-2 rounded-full h-8 w-8  flex items-center justify-center text-white ${
                            eventsData[n.context][n.eventName].bg
                          }`}
                        >
                          {eventsData[n.context][n.eventName].icon}
                        </span>
                        <div className="text-[10px]">
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {eventsData[n.context][n.eventName].text}
                          </span>
                          <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                            {new Date(n.createdOn).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </>
      )}
    </ComponentCard>
  );
}
