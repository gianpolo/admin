import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table/index.jsx";
import ComponentCard from "../common/ComponentCard.jsx";
import Input from "../form/input/InputField.jsx";
import Button from "../ui/button/Button.jsx"
export default function TourItemList({
  itemsStatus,
  itemsError,
  items,
  onItemSelection,
  highlightId,
  generateSlots,
}) {
  const [filterDate, setFilterDate] = useState("");
  const [filterId, setFilterId] = useState("");
  const sortedItems = [...items].sort((a, b) => {
    const ta = new Date(a.updatedAt || a.tourDate);
    const tb = new Date(b.updatedAt || b.tourDate);
    if (tb - ta !== 0) return tb - ta;
    return (a.name || "").localeCompare(b.name || "");
  });
  const filteredItems = sortedItems.filter((it) => {
    const dateOk = filterDate ? it.tourDate.startsWith(filterDate) : true;
    const idOk = filterId ? String(it.id).includes(filterId) : true;
    return dateOk && idOk;
  });

  return (
    <ComponentCard
      title={
        <div className="flex items-center">
          <div className="flex flex-auto">Schedulable Tour Items</div>
          <div>
            <Button size="sm" onClick={generateSlots}>
              Generate slots
            </Button>
          </div>
        </div>
      }
    >
      {itemsStatus === "loading" && <p>Loading items...</p>}
      {itemsError && <p className="text-red-500">{itemsError}</p>}
      {itemsStatus !== "loading" && !itemsError && (
        <div className="overflow-hidden ">
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
