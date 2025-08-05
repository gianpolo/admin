import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableCellHeader } from "../../../ui/table/index";
import { fetchSnapshotItems } from "../../../../store/snapshotsSlice";
import TourId from "../../../common/TourId";
import Spinner from "../../../ui/spinner/Spinner";
import Badge from "../../../ui/badge/Badge";
import { PencilIcon } from "../../../../icons";
export default function SelfSchedulingItems({ snapshotId }) {
  const dispatch = useDispatch();
  const { details } = useSelector((state) => state.snapshots);
  const items = details[snapshotId] ? details[snapshotId].items : null;
  const { status, data } = items;
  useEffect(() => {
    if (data === null) dispatch(fetchSnapshotItems(snapshotId));
  }, []);
  const statusColors = {
    0: { color: "warning", label: "Unknown" },
    1: { color: "success", label: "Confirmed" },
    2: { color: "warning", label: "missing forecast" },
    3: { color: "warning", label: "Not running day" },
  };
  const renderStatus = (dayCategory) => {
    const x = statusColors[dayCategory];
    return (
      <Badge variant="solid" color={x.color} size="xs">
        {x.label}
      </Badge>
    );
  };
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        {status === "succeeded" && items ? (
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCellHeader>
                  <div className="flex flex-col items-start">
                    <div>[ExpId-OptId] - Experience</div>
                    <div>Option</div>
                  </div>
                </TableCellHeader>
                <TableCellHeader>Date</TableCellHeader>
                <TableCellHeader>Time</TableCellHeader>
                <TableCellHeader>Status</TableCellHeader>
                <TableCellHeader>Initial Slots</TableCellHeader>
                <TableCellHeader>Edit</TableCellHeader>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05] text-sm">
              {status === "succeeded" &&
                data &&
                data.map((i) => (
                  <TableRow key={i.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.05]">
                    <TableCell className="px-5 py-2">
                      <div className="text-xs">
                        <TourId tourId={i.tourId} /> <span className="ml-2">{i.name.experienceName}</span>
                      </div>
                      <div className="font-medium text-gray-800 dark:text-white/90">{i.name.optionName}</div>
                    </TableCell>
                    <TableCell className="px-5 py-2">{i.tourDate}</TableCell>
                    <TableCell className="px-5 py-2">{i.tourTime}</TableCell>
                    <TableCell className="px-5 py-2">{renderStatus(i.dayCategory)}</TableCell>
                    <TableCell className="px-5 py-2">{i.initialSlotsAvailability || "-"}</TableCell>
                    <TableCell className="px-5 py-2">
                      <PencilIcon />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  );
}
