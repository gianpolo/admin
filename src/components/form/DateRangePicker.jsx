import { useState, useEffect, useRef, useCallback } from "react";
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
  maxDate,
  disabled = false,
}) {
  const flatPickr = useRef();
  const inputRef = useCallback((node) => {
    if (node !== null) {
      flatPickr.current = flatpickr(node, {
        mode: "range",
        dateFormat: "Y-m-d",
        locale: null,
        static: true,
        defaultDate: [value.startDate, value.endDate],
        minDate: minDate ? minDate.toISOString().split("T")[0] : undefined,
        maxDate: maxDate ? maxDate.toISOString().split("T")[0] : undefined,
        showMonths: 2,
        closeOnSelect: false,
        onChange: (selectedDates, dateStr) => { 
          const utcMidnights = selectedDates.map((d) => new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())));
          onChange?.({ startDate: utcMidnights[0], endDate: utcMidnights[1] }, dateStr);
          if (selectedDates.length === 2) {
            flatPickr.current.close();
          }
        },
      });
    }
  }, []);
  useEffect(() => {
    if (flatPickr.current) {
      flatPickr.current.setDate([parseDate(value.startDate), parseDate(value.endDate)], false);
    }
  }, [value.startDate, value.endDate]);
  const formatDate = (date) => (date instanceof Date ? date.toISOString().split("T")[0] : "");

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
          disabled={disabled}
          ref={inputRef}
          id={id}
          placeholder="start date"
          className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700  dark:focus:border-brand-800"
        />
        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          {!disabled && <CalenderIcon className="size-6" />}
        </span>
      </div>
    </div>
  );
}
