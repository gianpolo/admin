// Table Component
const Table = ({ children, className }) => {
  return <table className={`min-w-full  ${className}`}>{children}</table>;
};
// TableHeader Component
const TableHeader = ({ children, className }) => {
  return <thead className={className}>{children}</thead>;
};
// TableBody Component
const TableBody = ({ children, className }) => {
  return <tbody className={className}>{children}</tbody>;
};
// TableRow Component
const TableRow = ({ children, className, handleClick }) => {
  return (
    <tr onClick={handleClick} className={className}>
      {children}
    </tr>
  );
};
// TableCell Component
const TableCell = ({ children, isHeader = false, className, ...props }) => {
  const CellTag = isHeader ? "th" : "td";
  const cn = className || "px-6 py-4 whitespace-nowrap";
  return (
    <CellTag className={cn} {...props}>
      {children}
    </CellTag>
  );
};
const TableCellHeader = ({ children, className }) => {
  const cn = className || "px-6 py-3 whitespace-nowrap";
  return (
    <TableCell isHeader className={cn}>
      <div className="flex items-center">
        <p className="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
          {children}
        </p>
      </div>
    </TableCell>
  );
};
export { Table, TableHeader, TableBody, TableRow, TableCell, TableCellHeader };
