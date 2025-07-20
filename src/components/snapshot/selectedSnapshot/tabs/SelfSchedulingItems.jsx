import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableCellHeader } from "../../../ui/table/index";
import { fetchItems } from "../../../../store/snapshotsSlice";
import TourId from "../../../common/TourId";

export default function SelfSchedulingItems({ snapshotId }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchItems(snapshotId));
  }, [snapshotId]);
  const items = useSelector((state) => state.snapshots.details[snapshotId].items) || [];
  const status = useSelector((state) => state.snapshots.status);
  console.log(items);
  return status === "succeeded" ? (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
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
              <TableCellHeader>Day</TableCellHeader>
              <TableCellHeader>Initial Slots</TableCellHeader>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05] text-sm">
            {items.map((i) => (
              <TableRow key={i.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.05]">
                <TableCell className="px-5 py-2">
                  <div className="text-xs">
                    <TourId tourId={i.tourId} /> <span className="ml-2">{i.name.experienceName}</span>
                  </div>
                  <div className="font-medium text-gray-800 dark:text-white/90">{i.name.optionName}</div>
                </TableCell>
                <TableCell className="px-5 py-2">{i.tourDate}</TableCell>
                <TableCell className="px-5 py-2">{i.tourTime}</TableCell>
                <TableCell className="px-5 py-2">{i.dayCategory}</TableCell>
                <TableCell className="px-5 py-2">{i.initialSlotsAvailability}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  ) : (
    <span>x</span>
  );
}
