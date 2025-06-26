import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table/index.jsx";
import ComponentCard from "../../components/common/ComponentCard.jsx";
import Input from "../../components/form/input/InputField.jsx";
export default function TourItemList({
  itemsStatus,
  itemsError,
  config,
  items,
  onItemSelection,
}) {
  const [filterDate, setFilterDate] = useState("");
  const [filterId, setFilterId] = useState("");
  const [highlightId, setHighlightId] = useState(null);
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

  const sortedItems = [...items].sort((a, b) => {
    const da = new Date(a.tourDate);
    const db = new Date(b.tourDate);
    if (da - db !== 0) return da - db;
    return (a.name || "").localeCompare(b.name || "");
  });
  const filteredItems = sortedItems.filter((it) => {
    const dateOk = filterDate ? it.tourDate.startsWith(filterDate) : true;
    const idOk = filterId ? String(it.id).includes(filterId) : true;
    return dateOk && idOk;
  });

  return (
    <ComponentCard title="Schedulable Tour Items">
      {itemsStatus === "loading" && <p>Loading items...</p>}
      {itemsError && <p className="text-red-500">{itemsError}</p>}
      {itemsStatus !== "loading" && !itemsError && (
        <div className="overflow-hidden   bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] text-xs">
                <TableRow>
                  <TableCell isHeader className="px-6 py-2">
                    <Input
                      type="text"
                      placeholder="Filter by ID"
                      value={filterId}
                      onChange={(e) => setFilterId(e.target.value)}
                    />
                  </TableCell>
                  <TableCell isHeader className="px-6 py-2">
                    <Input
                      type="date"
                      value={filterDate}
                      onChange={(e) => setFilterDate(e.target.value)}
                    />
                  </TableCell>
                  <TableCell isHeader />
                  <TableCell isHeader />
                  <TableCell isHeader />
                </TableRow>
                <TableRow>
                  <TableCell isHeader className="px-6 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <p className="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                        Name / ID
                      </p>
                    </div>
                  </TableCell>
                  <TableCell isHeader className="px-6 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <p className="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                        Tour Date
                      </p>
                    </div>
                  </TableCell>
                  <TableCell isHeader className="px-6 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <p className="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                        Initial Slots
                      </p>
                    </div>
                  </TableCell>
                  <TableCell isHeader className="px-6 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <p className="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                        Reserved Slots
                      </p>
                    </div>
                  </TableCell>
                  <TableCell isHeader className="px-6 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <p className="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                        Confirmed Slots
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05] text-xs">
                {filteredItems.map((item) => (
                  <TableRow
                    key={item.id}
                    className={`cursor-pointer hover:dark:bg-white/[0.04] ${
                      highlightId === item.id ? "flash-update" : ""
                    }`}
                    handleClick={(event) => {
                      event.stopPropagation();
                      onItemSelection(item.id);
                    }}
                  >
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
                          {item.tourDate}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <p className="text-gray-500 text-theme-sm dark:text-gray-400">
                          {item.initialSlots}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <p className="text-gray-500 text-theme-sm dark:text-gray-400">
                          {item.reservedSlots || 0}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <p className="text-gray-500 text-theme-sm dark:text-gray-400">
                          {item.confirmedSlots || 0}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredItems.length === 0 && (
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
    </ComponentCard>
  );
}
