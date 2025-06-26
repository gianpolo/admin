import { useEffect, useState } from "react";
import { useParams } from "react-router";
import PageMeta from "../../components/common/PageMeta.jsx";
// import LogStream from "../../components/logviewer/LogStream.jsx";

export default function SelfSchedulingItemDetails() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    const backendUrl =
      import.meta.env.REACT_APP_BACKEND_URL || "http://localhost:5005/api/v1";
    fetch(`${backendUrl}/items/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch item");
        return res.json();
      })
      .then((data) => {
        setItem(data);
        setStatus("succeeded");
      })
      .catch((err) => {
        setError(err.message);
        setStatus("failed");
      });
  }, [id]);

  return (
    <>
      <PageMeta title="Item Details" description="Schedulable item overview" />
      {status === "loading" && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {item && (
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            {item.name}
          </h2>
          <p className="text-gray-500">ID: {item.id}</p>
          <p className="text-gray-500">Tour Date: {item.tourDate}</p>
          <p className="text-gray-500">Available Slots: {item.availableSlots}</p>
        </div>
      )}
      {/* <div className="mt-6">
        <LogStream itemId={id} />
      </div> */}
    </>
  );
}
