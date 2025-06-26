import { useEffect, useRef, useState } from "react";

export default function LogStream({ itemId }) {
  const [lines, setLines] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const backendUrl =
      import.meta.env.REACT_APP_BACKEND_URL || "http://localhost:5005/api/v1";
    const url = backendUrl.replace(/\/api\/v1\/?$/, "") + `/logs/stream?itemId=${itemId}`;
    const es = new EventSource(url, { withCredentials: false });
    es.onmessage = (e) => setLines((prev) => [...prev, e.data]);
    return () => es.close();
  }, [itemId]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div>
      <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">Logs</h3>
      <div
        ref={containerRef}
        className="h-64 overflow-y-auto rounded-md border border-gray-200 bg-gray-50 p-3 text-sm font-mono dark:border-white/[0.05] dark:bg-white/[0.03]"
      >
        {lines.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
    </div>
  );
}
