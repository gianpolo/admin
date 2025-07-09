import { useEffect, useState } from "react";
export default function DateTime({ date, time, separator = "at" }) {
  const [formatted, setFormatted] = useState("-");
  useEffect(() => {
    if (!date && !time) {
      setFormatted("-");
      return;
    }

    let d = "n/a";
    let t = "";

    if (date.includes("T")) {
      const dt = new Date(date);
      const dd = dt.getDate().toString().padStart(2, "0");
      const mm = (dt.getMonth() + 1).toString().padStart(2, "0");
      d = `${dd}/${mm}/${dt.getFullYear()}`;

      const h = dt.getHours();
      const suffix = h >= 12 ? "PM" : "AM";
      const h12 = h % 12 || 12;
      const min = dt.getMinutes().toString().padStart(2, "0");
      t = `${separator} ${h12}:${min} ${suffix}`;
    } else {
      if (date) {
        const [yyyy, mm, dd] = date.split("-");
        d = `${dd}/${mm}/${yyyy}`;
      }
      if (time) {
        const [hourStr, minute] = time.split(":");
        const h = parseInt(hourStr, 10);
        const suffix = h >= 12 ? "PM" : "AM";
        const h12 = h % 12 || 12;
        t = `${separator} ${h12}:${minute} ${suffix}`;
      }
    }

    setFormatted(`${d} ${t}`.trim());
  }, [date, time, separator]);

  return <span>{formatted}</span>;
}
