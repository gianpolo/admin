import { Table, TableHeader, TableBody, TableRow, TableCell, TableCellHeader } from "../ui/table/index.jsx";

export default function ForecastTable({ snapshot }) {
  if (!snapshot) return null;
  const { forecasts = [], groupSizes = [] } = snapshot;
  const sizeMap = {};
  groupSizes.forEach((g) => {
    sizeMap[g.optionId] = g.groupSize;
  });

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
              <TableCellHeader>Demand</TableCellHeader>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05] text-sm">
            {forecasts.map((f) => (
              <TableRow key={`${f.optionId}-${f.tourDate}`}>
                <TableCell className="px-5 py-2">{f.experienceId}</TableCell>
                <TableCell className="px-5 py-2">{f.optionId}</TableCell>
                <TableCell className="px-5 py-2">{f.tourDate}</TableCell>
                <TableCell className="px-5 py-2">
                  {sizeMap[f.optionId] ?? "-"}
                </TableCell>
                <TableCell className="px-5 py-2">{f.fulfillment}</TableCell>
                <TableCell className="px-5 py-2">{f.demand}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
