import { useEffect, useState } from "react";
import { useParams } from "react-router";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import Button from "../components/ui/button/Button";
import useGoBack from "../hooks/useGoBack";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../components/ui/table";
import { PlayIcon, StopIcon } from "../icons";
import { useNotifications } from "../context/NotificationContext.jsx";

const getToken = () => localStorage.getItem("token") || "";
const backend_url = import.meta.env.REACT_APP_BACKEND_URL || "http://localhost:5005/api/v1";

export default function SelfSchedulingConfigurationDetails() {
  const { id } = useParams();
  const goBack = useGoBack();
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
        setItems(Array.isArray(data) ? data : data.items || []);
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
      <PageBreadcrumb pageTitle="Configuration Details" />
      <div className="mb-4 flex items-center justify-between">
        <Button variant="outline" onClick={goBack}>Back</Button>
        {config && (
          config.isRunning ? (
            <Button
              variant="outline"
              className="text-red-600"
              startIcon={<StopIcon className="size-4" />}
              onClick={() => handleAction("close")}
            >
              Close
            </Button>
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
      {config && (
        <p className="mb-4 text-sm text-gray-500">
          {config.isRunning
            ? "This configuration is running"
            : "This configuration is not running"}
        </p>
      )}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {config && (
        <div className="space-y-3">
          <p><strong>Description:</strong> {config.description}</p>
          <p><strong>Scheduling Window:</strong> {config.schedulingWindowStart} - {config.schedulingWindowEnd}</p>
          <p><strong>Tours Period:</strong> {config.toursPeriodStart} - {config.toursPeriodEnd}</p>
          <p><strong>Experiences:</strong> {config.experienceIds && config.experienceIds.join(", ")}</p>
          <p><strong>Guides:</strong> {config.guideIds && config.guideIds.join(", ")}</p>
          <p><strong>Status:</strong> {config.isRunning ? "Running" : "Closed"}</p>
        </div>
      )}

      {itemsLoading && <p>Loading items...</p>}
      {itemsError && <p className="text-red-500">{itemsError}</p>}
      {!itemsLoading && !itemsError && (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] mt-6">
          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    colSpan={3}
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    {headerInfo()}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    ID / Name
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Tour Date
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Available Slots
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="px-5 py-4 text-start">
                      <div className="leading-snug">
                        <div className="text-sm font-normal text-gray-500">{item.id}</div>
                        <div className="text-brand-600 truncate">{item.name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">{item.tourDate}</TableCell>
                    <TableCell className="px-5 py-4 text-start">{item.availableSlots}</TableCell>
                  </TableRow>
                ))}
                {items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="px-5 py-4 text-center text-gray-500">
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
