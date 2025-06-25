import { useEffect } from "react";
import { Link, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import PageMeta from "../../components/common/PageMeta.jsx";
import useGoBack from "../../hooks/useGoBack.js";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table/index.jsx";
import { ChevronLeftIcon } from "../../icons";
import { simulateConfiguration } from "../../store/configurationsSlice.js";
import {
  fetchConfigurationDetails,
  fetchConfigurationItems,
  performConfigurationAction,
  updateAvailableSlots,
} from "../../store/configurationDetailsSlice.js";
import { useNotifications } from "../../context/NotificationContext.jsx";
import ConfigurationInfoCard from "../../components/configuration/ConfigurationInfoCard.jsx";

export default function SelfSchedulingConfigurationDetails() {
  const { id } = useParams();
  const goBack = useGoBack();
  const dispatch = useDispatch();
  const { simulationMessage } = useSelector((state) => state.configurations);
  const { config, items, status, itemsStatus, error, itemsError } = useSelector(
    (state) => state.configDetails
  );
  const { onBasketItemAdded, offBasketItemAdded } = useNotifications();

  useEffect(() => {
    dispatch(fetchConfigurationDetails(id));
    dispatch(fetchConfigurationItems(id));
  }, [dispatch, id]);

  useEffect(() => {
    const handler = ({ itemId }) => {
      dispatch(updateAvailableSlots({ itemId }));
    };
    onBasketItemAdded(handler);
    return () => offBasketItemAdded(handler);
  }, [dispatch, onBasketItemAdded, offBasketItemAdded]);

  const handleAction = (action) => {
    dispatch(performConfigurationAction({ id, action }));
  };

  const handleSimulation = () => {
    if (!config) return;
    dispatch(simulateConfiguration({ guideIds: config.guideIds || [] }));
  };

  const sortedItems = [...items].sort((a, b) => {
    const da = new Date(a.tourDate);
    const db = new Date(b.tourDate);
    if (da - db !== 0) return da - db;
    return (a.name || "").localeCompare(b.name || "");
  });

  const headerInfo = () => {
    if (!config) return "";
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const from = new Date(config.schedulingWindowStart);
    const end = new Date(config.schedulingWindowEnd);
    from.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    const dayMs = 86400000;

    if (config.isRunning) {
      const diff = Math.floor((today - from) / dayMs);
      return `Running for ${diff} day${diff === 1 ? "" : "s"}`;
    }
    if (today < from) {
      const diff = Math.ceil((from - today) / dayMs);
      return `${diff} day${diff === 1 ? "" : "s"} remaining`;
    }
    const diff = Math.floor((today - end) / dayMs);
    return `Closed for ${diff} day${diff === 1 ? "" : "s"}`;
  };

  return (
    <>
      <PageMeta
        title="Configuration Details"
        description="Configuration information"
      />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={(event) => {
              event.stopPropagation();
              goBack();
            }}
            className="text-gray-400 text-2xl flex mr-10 hover:text-gray-800"
          >
            <ChevronLeftIcon className="inline-block" />
          </button>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            Configuration Details
          </h2>
        </div>
        <nav>
          <ol className="flex items-center gap-1.5">
            <li>
              <Link
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
                to="/"
              >
                Home
                <svg
                  className="stroke-current"
                  width="17"
                  height="16"
                  viewBox="0 0 17 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </li>
            <li className="text-sm text-gray-800 dark:text-white/90">
              Configuration Details
            </li>
          </ol>
        </nav>
      </div>
      {simulationMessage && (
        <p className="mb-4 text-sm text-blue-500">{simulationMessage}</p>
      )}

      {status === "loading" && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {config && (
        <ConfigurationInfoCard
          config={config}
          onAction={handleAction}
          onSimulation={handleSimulation}
        />
      )}

      {itemsStatus === "loading" && <p>Loading items...</p>}
      {itemsError && <p className="text-red-500">{itemsError}</p>}
      {itemsStatus !== "loading" && !itemsError && (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] mt-6">
          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] text-xs">
                <TableRow>
                  <TableCell isHeader className="px-6 py-3 whitespace-nowrap">
                    {" "}
                    <div className="flex items-center">
                      <p className="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                        {" "}
                        {headerInfo()}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell isHeader className="px-6 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <p className="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                        {" "}
                        Name / ID
                      </p>
                    </div>
                  </TableCell>
                  <TableCell isHeader className="px-6 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <p className="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                        {" "}
                        Tour Date
                      </p>
                    </div>
                  </TableCell>
                  <TableCell isHeader className="px-6 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <p className="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                        Initial Availability
                      </p>
                    </div>{" "}
                  </TableCell>
                  <TableCell isHeader className="px-6 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <p className="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                        Reserved Slots
                      </p>
                    </div>{" "}
                  </TableCell>
                  <TableCell isHeader className="px-6 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <p className="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                        Confirmed Slots
                      </p>
                    </div>{" "}
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05] text-xs">
                {sortedItems.map((item) => (
                  <TableRow key={item.id} handleClick={() => {}}>
                    <TableCell>
                      <div className="leading-snug">
                        <div className="dark:text-white font-medium truncate">
                          {item.name}
                        </div>
                        <div className="text-theme-xs text-gray-400 dark:text-gray-400">
                          {item.id}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <p className="text-gray-500 text-theme-sm dark:text-gray-400">
                          {" "}
                          {item.tourDate}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <p className="text-gray-500 text-theme-sm dark:text-gray-400">
                          {item.availableSlots}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {sortedItems.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="px-5 py-2 text-center text-gray-500"
                    >
                      No items found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </>
  );
}
