import { useState, useEffect } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import Label from "./Label";

export default function DateRangePicker({
  label,
  value = { startDate: null, endDate: null },
  onChange,
  minDate,
  maxDate,
  ...props
}) {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange = (val) => {
    setInternalValue(val);
    onChange?.(val);
  };

  return (
    <div>
      {label && <Label>{label}</Label>}
      <Datepicker
        value={internalValue}
        onChange={handleChange}
        useRange
        asSingle={false}
        minDate={minDate}
        maxDate={maxDate}
        displayFormat="YYYY-MM-DD"
        {...props}
      />
    </div>
  );
}
