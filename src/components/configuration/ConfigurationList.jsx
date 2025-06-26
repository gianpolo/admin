import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableCellHeader,
} from "../ui/table";
import { PlayIcon, StopIconCircle, TrashBinIcon } from "../../icons";
import Spinner from "../ui/spinner/Spinner";
import Badge from "../ui/badge/Badge.jsx";
export default function ConfigurationList({
  list,
  actionStatus,
  highlightId,
  onOpen,
  onClose,
  onDelete,
  onItemSelection,
}) {
  const formatPeriod = (start, end) =>
    `${(start || "").replace(/-/g, "/")} to ${(end || "").replace(/-/g, "/")}`;

  const renderAction = (cfg) => {
    if (cfg.isRunning)
      return (
        <button
          onClick={(event) => {
            event.stopPropagation();
            onClose(cfg.id);
          }}
          className="text-red-600 text-lg hover:text-2xl"
        >
          <StopIconCircle className="inline-block" />
        </button>
      );

    return (
      <button
        onClick={(event) => {
          event.stopPropagation();
          onOpen(cfg.id);
        }}
        className="text-green-600 text-lg hover:text-2xl"
      >
        <PlayIcon className="inline-block" />
      </button>
    );
  };

  return (
    <Table>
      <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
        <TableRow>
          <TableCellHeader>Actions</TableCellHeader>
          <TableCellHeader>Description / ID</TableCellHeader>
          <TableCellHeader>Scheduling Window</TableCellHeader>
          <TableCellHeader>Tours Period</TableCellHeader>
          <TableCellHeader>City ID</TableCellHeader>
          <TableCellHeader>Experiences Count</TableCellHeader>
          <TableCellHeader>Guides Count</TableCellHeader>
          <TableCellHeader>Delete</TableCellHeader>
        </TableRow>
      </TableHeader>
      <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
        {list.map((cfg) => { 
          const loading = actionStatus[cfg.id] === "loading";
          return (
            <TableRow
              key={cfg.id}
              className={`cursor-pointer ${
                cfg.id === highlightId ? "bg-blue-50 dark:bg-blue-900/10" : ""
              } ${
                cfg.isRunning ? " dark:bg-brand-500/12" : ""
              } hover:dark:bg-white/[0.04]`}
              handleClick={(event) => {
                event.stopPropagation();
                onItemSelection(cfg.id);
              }}
            >
              <TableCell>{loading ? <Spinner /> : renderAction(cfg)}</TableCell>
              <TableCell>
                <div className="leading-snug">
                  <div className="dark:text-white font-medium truncate flex items-center gap-1">
                    {cfg.description}
                    {highlightId === cfg.id && (
                      <Badge variant="light" color="info">
                        NEW
                      </Badge>
                    )}
                  </div>
                  <div
                    className={`text-theme-xs   ${
                      cfg.isRunning ? "text-gray-400" : "dark:text-gray-400"
                    }`}
                  >
                    {cfg.id}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <p className="text-gray-500 text-theme-sm dark:text-gray-400">
                    {formatPeriod(
                      cfg.schedulingWindowStart,
                      cfg.schedulingWindowEnd
                    )}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <p className="text-gray-500 text-theme-sm dark:text-gray-400">
                    {formatPeriod(cfg.toursPeriodStart, cfg.toursPeriodEnd)}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <p className="text-gray-500 text-theme-sm dark:text-gray-400">
                    {cfg.cityId}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <p className="text-gray-500 text-theme-sm dark:text-gray-400">
                    {cfg.experienceIds && cfg.experienceIds.length}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <p className="text-gray-500 text-theme-sm dark:text-gray-400">
                    {cfg.guideIds && cfg.guideIds.length}
                  </p>
                </div>
              </TableCell>
              <TableCell
                className="px-6 py-3 whitespace-nowrap"
                onClick={(e) => e.stopPropagation()}
              >
                {loading ? (
                  <Spinner />
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={onDelete}
                      className="text-gray-500 text-lg hover:text-red-600"
                    >
                      <TrashBinIcon className="inline-block" />
                    </button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
