import { Table, TableHeader, TableBody, TableRow, TableCell, TableCellHeader } from "../ui/table/index.jsx";
import DateRange from "../common/DateRange.jsx";
export default function TourSnapshots({ tours }) {
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
              <TableCellHeader>Tour</TableCellHeader>
              <TableCellHeader>
                <div>Occurrences during period </div>
                <div>From - To</div>
              </TableCellHeader>
              <TableCellHeader>Group Size</TableCellHeader>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05] text-sm">
            {tours.map((f) => (
              <TableRow key={`${f.tourId.optionId}`} className="hover:bg-gray-50 dark:hover:bg-white/[0.05]">
                <TableCell className="px-5 py-2">
                  <div className="text-xs ">
                    [{f.tourId.experienceId} -{f.tourId.optionId}] - {f.name.experienceName}
                  </div>
                  <div className="font-medium text-gray-800 dark:text-white/90">{f.name.optionName}</div>
                </TableCell>
                <TableCell className="px-5 py-2">{renderOccurrences(f.tourOccurrences)}</TableCell>
                <TableCell className="px-5 py-2">{f.groupSize}</TableCell>
                <TableCell className="px-5 py-2">{f.forecast}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
