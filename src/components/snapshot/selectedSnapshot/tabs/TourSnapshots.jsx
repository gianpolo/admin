import { Table, TableHeader, TableBody, TableRow, TableCell, TableCellHeader } from "../../../ui/table/index";
import DateRange from "../../../common/DateRange";
import TourId from "../../../common/TourId";
import { useSelector } from "react-redux";
export default function TourSnapshots({ snapshotId }) {
  const { details, status } = useSelector((state) => state.snapshots);
  const tours = details[snapshotId] ? details[snapshotId].tours : null;
  const renderOccurrences = (occurrences) => {
    return occurrences.map((o) => {
      return (
        <div key={`${o.from}-${o.to}`} className="text-xs">
          <DateRange from={o.from} to={o.to} includeDaysCount />
        </div>
      );
    });
  };
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCellHeader>
                <div className="flex flex-col items-start ">
                  <div>[ExpId-OptId] - Experience</div>
                  <div>Option</div>
                </div>
              </TableCellHeader>
              <TableCellHeader>Group Size</TableCellHeader>
              <TableCellHeader>
                <div className="flex flex-col items-start">
                  <div>Occurrences overlapping SelfScheduling Tours Period </div>
                  <div>From - To</div>
                </div>
              </TableCellHeader>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05] text-sm">
            {status === "succeeded" &&
              tours &&
              tours.map((t) => (
                <TableRow key={`${t.tourId.optionId}`} className="hover:bg-gray-50 dark:hover:bg-white/[0.05]">
                  <TableCell className="px-5 py-2">
                    <div className="text-xs">
                      <TourId tourId={t.tourId} /> <span className="ml-2">{t.name.experienceName}</span>
                    </div>
                    <div className="font-medium text-gray-800 dark:text-white/90">{t.name.optionName}</div>
                  </TableCell>
                  <TableCell className="px-5 py-2">{t.groupSize}</TableCell>
                  <TableCell className="px-5 py-2">{renderOccurrences(t.tourOccurrences)}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
