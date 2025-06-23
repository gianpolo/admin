import { useState, useEffect } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import Label from "./Label";
import { CalenderIcon } from "../../icons";
export default function MyDateRangePicker({
  id,
  label,
  value = { startDate: null, endDate: null },
  onChange,
  minDate,
  maxDate
}) {
  useEffect(() => {

    const flatPickr = flatpickr(`#${id}`, {
      mode: "range",
      dateFormat: "Y-m-d",
      static: true,
      defaultDate: [value[0], value[1]],
      closeOnSelect: false,
      onChange: (selectedDates, dateStr, fp) => {
        debugger;
        onChange?.(selectedDates, dateStr);
        if (selectedDates.length === 2) {
          fp.close();
        }
      },
    });

    return () => {
      if (!Array.isArray(flatPickr)) {
        flatPickr.destroy();
      }
    };
  }, [onChange, id]);
  const formatDate = (date) =>
    date instanceof Date ? date.toISOString().split("T")[0] : "";

  const parseDate = (str) => (str ? new Date(str) : null);

  const inputClass =
    "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800";

  const min = minDate ? formatDate(minDate) : undefined;
  const max = maxDate ? formatDate(maxDate) : undefined;

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="relative">
        <input
          id={id}
          placeholder="start date"
          className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700  dark:focus:border-brand-800"
        />

        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          <CalenderIcon className="size-6" />
        </span>
      </div>
    </div>

  );
}
