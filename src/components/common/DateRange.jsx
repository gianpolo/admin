import { useEffect, useState } from "react";
import Badge from "../ui/badge/Badge.jsx";
import DateTime from "./DateTime.jsx";
export default function DateRange({ from, to, separator = "-", includeDaysCount = false, size = "md" }) {
  const getDaysCount = (from, to) => {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const daysCount = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24));
    return daysCount;
  };
  const [daysCount, setDaysCount] = useState(null);
  useEffect(() => {
    if (!from || !to) return;
    if (includeDaysCount) {
      const daysCount = getDaysCount(from, to);
      setDaysCount(daysCount);
    }
  }, [from, to, setDaysCount, includeDaysCount]);

  return (
    <>
      <div className="flex items-center ">
        <DateTime date={from} size={size} /> &nbsp;{separator}&nbsp;
        <DateTime date={to} size={size} />{" "}
        {includeDaysCount && (
          <p className="ml-3">
            <Badge size="xs" color="info">
              {daysCount} days
            </Badge>
          </p>
        )}
      </div>
    </>
  );
}
