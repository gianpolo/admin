import { useEffect } from "react";
import { useParams } from "react-router";
import ComponentCard from "../common/ComponentCard";
import { eventsData } from "../../utils/constants";
import { Table, TableBody, TableCell, TableRow } from "../ui/table/index";

export default function NotificationsWidget({ notifications, logs, history, setHistory = () => {} }) {
  const { id } = useParams();

  useEffect(() => {
    if (notifications && notifications.length > 0) {
      const newItems = notifications.filter(
        (n) => !history.find((e) => e.key === n.key && e.eventName === n.eventName)
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
                {history.map((n, idx) => {
                  return (
                    <TableRow className="text-[10px] w-full" key={`${n.createdOn}-${n.key}`}>
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
