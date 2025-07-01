import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router";
import ComponentCard from "../common/ComponentCard.jsx";
import { eventsData } from "../../utils/constants.jsx";
import { Table, TableBody, TableCell, TableRow } from "../ui/table/index.jsx";
import { fetchEventsLogs } from "../../store/notificationsSlice.js";
export default function NotificationsWidget() {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications.items);
  const logs = useSelector((state) => state.notifications.logs);
  const [history, setHistory] = useState([...logs]);
  const { id } = useParams();
  useEffect(() => {
    dispatch(fetchEventsLogs(id));
  }, [id]);
  useEffect(() => {
    const initialLogs = [...logs];
    setHistory(initialLogs);
  }, [logs]);

  useEffect(() => {
    if (notifications && notifications.length > 0) {
      const newItems = notifications.filter(
        (n) =>
          !history.find((e) => e.key === n.key && e.eventName === n.eventName)
      );
      if (newItems.length > 0) {
        setHistory((prev) => [...prev, ...newItems]);
      }
    }
  }, [notifications]);

  return (
    <ComponentCard title="Events log">
      {logs.length === 0 && notifications.length === 0 ? (
        <p className=" text-sm text-gray-500 dark:text-gray-400">No history</p>
      ) : (
        <>
          <div className="max-h-64 overflow-y-auto custom-scrollbar">
            <Table>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {/* {logs.map((n, idx) => {
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
                })} */}
                {history.map((n, idx) => {
                  return (
                    <TableRow
                      className="text-[10px] w-full"
                      key={`${n.createdOn}-${n.key}`}
                    >
                      <TableCell className="px-2 py-2 sm:px-2 sm:pr-4 text-start ">
                        <div className="flex items-center gap-3">
                          <span
                            className={`mr-2 rounded-full h-8 w-8  flex items-center justify-center text-white ${
                              eventsData[n.context][n.eventName].bg
                            }`}
                          >
                            {eventsData[n.context][n.eventName].icon}
                          </span>
                          <div className="text-[10px] flex-1">
                            <span className="block font-medium  text-theme-sm dark:text-white/90">
                              {eventsData[n.context][n.eventName].render(n)}
                            </span>
                            <span className="block text-gray-800 text-theme-xs text-right dark:text-gray-500 italic">
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
          </div>
        </>
      )}
    </ComponentCard>
  );
}
