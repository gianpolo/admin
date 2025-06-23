import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import PageMeta from "../components/common/PageMeta";
import Button from "../components/ui/button/Button";
import useGoBack from "../hooks/useGoBack";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../components/ui/table";
import { PlayIcon, StopIconCircle, ChevronLeftIcon } from "../icons";
import { simulateConfiguration } from "../store/configurationsSlice";
import { useNotifications } from "../context/NotificationContext.jsx";
import ConfigurationInfoCard from "../components/configuration/ConfigurationInfoCard.jsx";

const getToken = () => localStorage.getItem("token") || "";
const backend_url = import.meta.env.REACT_APP_BACKEND_URL || "http://localhost:5005/api/v1";

export default function SelfSchedulingConfigurationDetails() {
  const { id } = useParams();
  const goBack = useGoBack();
  const dispatch = useDispatch();
  const { simulationMessage } = useSelector((state) => state.configurations);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [itemsError, setItemsError] = useState("");
  const { onAvailableSlotsUpdated, offAvailableSlotsUpdated } = useNotifications();

  useEffect(() => {
    async function load() {
      try {
        const token = getToken();
        const res = await fetch(`${backend_url}/configurations/${id}`, {
          headers: { "Authorization": `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch configuration");
        const data = await res.json();
        setConfig(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  useEffect(() => {
    async function loadItems() {
      try {
        const token = getToken();
        const res = await fetch(`${backend_url}/items?configurationId=${id}`, {
          headers: { "Authorization": `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch tour items");
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.items || [];
        list.sort((a, b) => {
          const da = new Date(a.tourDate);
          const db = new Date(b.tourDate);
          if (da - db !== 0) return da - db;
          return (a.name || "").localeCompare(b.name || "");
        });
        setItems(list);
      } catch (err) {
        setItemsError(err.message);
      } finally {
        setItemsLoading(false);
      }
    }
    loadItems();
  }, [id]);

  useEffect(() => {
    const handler = ({ itemId, availableSlots }) => {
      setItems((prev) =>
        prev.map((it) =>
          it.id === itemId ? { ...it, availableSlots } : it
        )
      );
    };
    onAvailableSlotsUpdated(handler);
    return () => offAvailableSlotsUpdated(handler);
  }, [onAvailableSlotsUpdated, offAvailableSlotsUpdated]);

  const handleAction = async (action) => {
    try {
      const token = getToken();
      const res = await fetch(`${backend_url}/configurations/${id}/${action}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Action failed");
      const data = await res.json();
      setConfig(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSimulation = () => {
    if (!config) return;
    dispatch(simulateConfiguration({ guideIds: config.guideIds || [] }));
  };

  const headerInfo = () => {
    if (!config) return "";
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(config.schedulingWindowStart);
    const end = new Date(config.schedulingWindowEnd);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    const dayMs = 86400000;

    if (config.isRunning) {
      const diff = Math.floor((today - start) / dayMs);
      return `Running for ${diff} day${diff === 1 ? "" : "s"}`;
    }
    if (today < start) {
      const diff = Math.ceil((start - today) / dayMs);
      return `${diff} day${diff === 1 ? "" : "s"} remaining`;
    }
    const diff = Math.floor((today - end) / dayMs);
    return `Closed for ${diff} day${diff === 1 ? "" : "s"}`;
  };

  return (
    <>
      <PageMeta title="Configuration Details" description="Configuration information" />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goBack}
            startIcon={<ChevronLeftIcon className="size-4" />}
          />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Configuration Details</h2>
        </div>
        <nav>
          <ol className="flex items-center gap-1.5">
            <li>
              <Link className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400" to="/">
                Home
                <svg className="stroke-current" width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </li>
            <li className="text-sm text-gray-800 dark:text-white/90">Configuration Details</li>
          </ol>
        </nav>
      </div>
      <div className="mb-4 flex items-center justify-between">
        {config && (
          config.isRunning ? (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSimulation}>Simulate</Button>
              <Button
                variant="outline"
                className="text-red-600"
                startIcon={<StopIconCircle className="size-4" />}
                onClick={() => handleAction("close")}
              >
                Close
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              className="text-green-600"
              startIcon={<PlayIcon className="size-4" />}
              onClick={() => handleAction("open")}
            >
              Open
            </Button>
          )
        )}
      </div>
      {simulationMessage && (
        <p className="mb-4 text-sm text-blue-500">{simulationMessage}</p>
      )}

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {config && <ConfigurationInfoCard config={config} />}


      {itemsLoading && <p>Loading items...</p>}
      {itemsError && <p className="text-red-500">{itemsError}</p>}
      {
        !itemsLoading && !itemsError && (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] mt-6">
            <div className="max-w-full overflow-x-auto">
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] text-xs">
                  <TableRow>
                    <TableCell
                      isHeader
                      className="px-6 py-3 whitespace-nowrap"
                    > <div class="flex items-center">
                        <p className="font-medium text-gray-500 text-theme-xs dark:text-gray-400">  {headerInfo()}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      isHeader
                      className="px-6 py-3 whitespace-nowrap"
                    ><div class="flex items-center">
                        <p className="font-medium text-gray-500 text-theme-xs dark:text-gray-400"> Name / ID</p>
                      </div></TableCell>
                    <TableCell
                      isHeader
                      className="px-6 py-3 whitespace-nowrap"
                    ><div class="flex items-center">
                        <p className="font-medium text-gray-500 text-theme-xs dark:text-gray-400"> Tour Date</p>
                      </div></TableCell>
                    <TableCell
                      isHeader
                      className="px-6 py-3 whitespace-nowrap"
                    ><div class="flex items-center">
                        <p className="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Initial Availability</p>
                      </div> </TableCell>
                    <TableCell
                      isHeader
                      className="px-6 py-3 whitespace-nowrap"
                    ><div class="flex items-center">
                        <p className="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Reserved Slots</p>
                      </div> </TableCell>
                    <TableCell
                      isHeader
                      className="px-6 py-3 whitespace-nowrap"
                    ><div class="flex items-center">
                        <p className="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Confirmed Slots</p>
                      </div> </TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05] text-xs">
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="px-6 py-3 whitespace-nowrap">
                        <div className="leading-snug">
                          <div className="dark:text-white font-medium truncate">{item.name}</div>
                          <div className="text-theme-xs text-gray-400 dark:text-gray-400">{item.id}</div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-3 whitespace-nowrap">
                        <div class="flex items-center">
                          <p className="text-gray-500 text-theme-sm dark:text-gray-400" > {item.tourDate}</p>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-3 whitespace-nowrap">
                        <div class="flex items-center">
                          <p className="text-gray-500 text-theme-sm dark:text-gray-400" >{item.availableSlots}</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {items.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="px-5 py-2 text-center text-gray-500">
                        No items found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )
      }
    </>
  );
}
