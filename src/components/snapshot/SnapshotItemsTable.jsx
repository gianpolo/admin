import { Table, TableHeader, TableBody, TableRow, TableCell, TableCellHeader } from "../ui/table/index.jsx";
import DateTime from "../common/DateTime";
export default function SnapshotItemsTable({ snapshotItems }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCellHeader>Experience ID</TableCellHeader>
              <TableCellHeader>Option ID</TableCellHeader>
              <TableCellHeader>Tour Date</TableCellHeader>
              <TableCellHeader>Group Size</TableCellHeader>
              <TableCellHeader>Fulfillment</TableCellHeader>
              <TableCellHeader>Slots</TableCellHeader>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05] text-sm">
            {snapshotItems.map((f) => (
              <TableRow key={`${f.tour.optionId}-${f.tourDate}`}>
                <TableCell className="px-5 py-2">{f.tour.experienceId}</TableCell>
                <TableCell className="px-5 py-2">{f.tour.optionId}</TableCell>
                <TableCell className="px-5 py-2">
                  <DateTime date={f.tourDate} time={f.tourStartTime} />
                </TableCell>
                <TableCell className="px-5 py-2">{f.groupSize}</TableCell>
                <TableCell className="px-5 py-2">{f.forecast}</TableCell>
                <TableCell className="px-5 py-2">{f.slots ?? "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
