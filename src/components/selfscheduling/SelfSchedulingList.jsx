import { Table, TableBody, TableCell, TableHeader, TableRow, TableCellHeader } from "../ui/table/index";
import { PlayIcon, StopIconCircle, TrashBinIcon } from "../../icons/index.js";
import Spinner from "../ui/spinner/Spinner";
import Badge from "../ui/badge/Badge";
export default function SelfSchedulingList({
  list,
  actionStatus,
  highlightId,
  onOpen,
  onClose,
  onDelete,
  onItemSelection,
}) {
  const formatPeriod = (start, end) => `${(start || "").replace(/-/g, "/")} to ${(end || "").replace(/-/g, "/")}`;

  const renderAction = (ss) => {
    if (ss.isRunning)
      return (
        <button
          onClick={(event) => {
            event.stopPropagation();
            onClose(ss.selfSchedulingId);
          }}
          className="text-red-500 text-lg hover:text-2xl"
        >
          <StopIconCircle className="inline-block" />
        </button>
      );

    return (
      <button
        onClick={(event) => {
          event.stopPropagation();
          onOpen(ss.id);
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
          <TableCellHeader>Snapshots Count</TableCellHeader>
          <TableCellHeader>Delete</TableCellHeader>
        </TableRow>
      </TableHeader>
      <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
        {list.map((ss) => {
          const loading = actionStatus[ss.id] === "loading";
          return (
            <TableRow
              key={ss.selfSchedulingId}
              className={`cursor-pointer ${ss.id === highlightId ? "bg-blue-50 dark:bg-blue-900/10" : ""} ${
                ss.isRunning ? " dark:bg-brand-500/12" : ""
              } hover:dark:bg-white/[0.04]`}
              handleClick={(event) => {
                event.stopPropagation();
                onItemSelection(ss.selfSchedulingId);
              }}
            >
              <TableCell>{loading ? <Spinner /> : renderAction(ss)}</TableCell>
              <TableCell>
                <div className="leading-snug">
                  <div className="dark:text-white font-medium truncate flex items-center gap-1">
                    {ss.description}
                    {highlightId === ss.selfSchedulingId && (
                      <Badge variant="light" color="info">
                        NEW
                      </Badge>
                    )}
                  </div>
                  <div className={`text-theme-xs   ${ss.isRunning ? "text-gray-400" : "dark:text-gray-400"}`}>
                    {ss.id}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <p className="text-gray-500 text-theme-sm dark:text-gray-400">
                    {formatPeriod(ss.schedulingWindow.start, ss.schedulingWindow.end)}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <p className="text-gray-500 text-theme-sm dark:text-gray-400">
                    {formatPeriod(ss.toursPeriod.start, ss.toursPeriod.end)}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <p className="text-gray-500 text-theme-sm dark:text-gray-400">{ss.cityId}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <p className="text-gray-500 text-theme-sm dark:text-gray-400">{ss.experiencesCount}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <p className="text-gray-500 text-theme-sm dark:text-gray-400">{ss.guidesCount}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <p className="text-gray-500 text-theme-sm dark:text-gray-400">
                    {ss.snapshotsCount > 0 ? (
                      <Badge variant="solid" color="info">
                        {ss.snapshotsCount}
                      </Badge>
                    ) : (
                      <span>n/a</span>
                    )}
                  </p>
                </div>
              </TableCell>
              <TableCell className="px-6 py-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                {loading ? (
                  <Spinner />
                ) : (
                  <div className="flex items-center gap-2">
                    <button onClick={onDelete} className="text-gray-500 text-lg hover:text-red-600">
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
