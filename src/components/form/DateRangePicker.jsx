import Label from "./Label";

export default function DateRangePicker({
  label,
  value = { startDate: null, endDate: null },
  onChange,
  minDate,
  maxDate,
  ...props
}) {
  const formatDate = (date) =>
    date instanceof Date ? date.toISOString().split("T")[0] : "";

  const parseDate = (str) => (str ? new Date(str) : null);

  const handleStartChange = (e) => {
    onChange?.({
      startDate: parseDate(e.target.value),
      endDate: value.endDate,
    });
  };

  const handleEndChange = (e) => {
    onChange?.({
      startDate: value.startDate,
      endDate: parseDate(e.target.value),
    });
  };

  const inputClass =
    "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800";

  const min = minDate ? formatDate(minDate) : undefined;
  const max = maxDate ? formatDate(maxDate) : undefined;

  return (
    <div {...props}>
      {label && <Label>{label}</Label>}
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={formatDate(value.startDate)}
          onChange={handleStartChange}
          min={min}
          max={max}
          className={inputClass}
        />
        <span className="mx-1">-</span>
        <input
          type="date"
          value={formatDate(value.endDate)}
          onChange={handleEndChange}
          min={min}
          max={max}
          className={inputClass}
        />
      </div>
    </div>
  );
}
