import { useEffect, useState } from "react";
import ComponentCard from "../common/ComponentCard";
import VerticalTabs from "../common/VerticalTabs.jsx";

export default function VerticalSnapshots({ snapshots = [] }) {
  const [tabsData, setTabsData] = useState([]);

  useEffect(() => {
    if (snapshots && snapshots.length > 0) {
      const tabs = snapshots.map((s) => ({
        label: s.label,
        content: (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Placeholder content
          </div>
        ),
      }));
      setTabsData(tabs);
    }
  }, [snapshots]);

  if (!tabsData || tabsData.length === 0) {
    return (
      <ComponentCard title="Snapshots">
        <p className="text-sm text-gray-500 dark:text-gray-400">No snapshots</p>
      </ComponentCard>
    );
  }

  return (
    <ComponentCard title="Snapshots">
      <VerticalTabs tabsData={tabsData} />
    </ComponentCard>
  );
}
