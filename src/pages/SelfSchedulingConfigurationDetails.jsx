import { useEffect, useState } from "react";
import { useParams } from "react-router";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import Button from "../components/ui/button/Button";
import useGoBack from "../hooks/useGoBack";

const getToken = () => localStorage.getItem("token") || "";
const backend_url = import.meta.env.REACT_APP_BACKEND_URL || "http://localhost:5005/api/v1";

export default function SelfSchedulingConfigurationDetails() {
  const { id } = useParams();
  const goBack = useGoBack();
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const token = getToken();
        const res = await fetch(`${backend_url}/configurations/${id}`, {
          headers: { "Authorization": `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch configuration");
        const data = await res.json();
        setConfig(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleAction = async (action) => {
    try {
      const token = getToken();
      const res = await fetch(`${backend_url}/configurations/${id}/${action}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Action failed");
      const data = await res.json();
      setConfig(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <PageMeta title="Configuration Details" description="Configuration information" />
      <PageBreadcrumb pageTitle="Configuration Details" />
      <div className="mb-4">
        <Button variant="outline" onClick={goBack}>Back</Button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {config && (
        <div className="space-y-3">
          <p><strong>Description:</strong> {config.description}</p>
          <p><strong>Scheduling Window:</strong> {config.schedulingWindowStart} - {config.schedulingWindowEnd}</p>
          <p><strong>Tours Period:</strong> {config.toursPeriodStart} - {config.toursPeriodEnd}</p>
          <p><strong>Experiences:</strong> {config.experienceIds && config.experienceIds.join(", ")}</p>
          <p><strong>Guides:</strong> {config.guideIds && config.guideIds.join(", ")}</p>
          <p><strong>Status:</strong> {config.isRunning ? "Running" : "Closed"}</p>
          <div className="flex gap-2">
            <Button onClick={() => handleAction("open")}>Open</Button>
            <Button variant="outline" onClick={() => handleAction("close")}>Close</Button>
          </div>
        </div>
      )}
    </>
  );
}
