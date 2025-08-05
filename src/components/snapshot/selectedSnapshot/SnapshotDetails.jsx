import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SnapshotOverview from "./SnapshotOverview.jsx";
import Spinner from "../../ui/spinner/Spinner.jsx";
import ComponentCard from "../../common/ComponentCard.jsx";
import TourSnapshots from "./tabs/TourSnapshots.jsx";
import ForecastSnapshots from "./tabs/ForecastSnapshots.jsx";
import SelfSchedulingItems from "./tabs/SelfSchedulingItems.jsx";
import SnapshotDetailsTitle from "./SnapshotDetailsTitle.jsx";
import Tabs from "../../common/Tabs.jsx";

export default function SnapshotDetails({
  snapshotId,
  isActive,
  loading,
  onActivateSnapshot,
  onPublishSnapshot,
}) {
  const [tabs, setTabs] = useState(null);
  const { details, status } = useSelector((state) => state.snapshots);
  const snapshot = details ? details[snapshotId] : null;
  const { summary } = snapshot;
  const { snapshotDate, createdAt } = summary.data;
  useEffect(() => {
    const tabs = [
      {
        label: "Tours",
        content: <TourSnapshots snapshotId={snapshotId} />,
      },
      {
        label: "Forecasting",
        content: <ForecastSnapshots snapshotId={snapshotId} />,
      },
      {
        label: "Guides",
        content: <span>Guides</span>,
      },
      {
        label: "Allocations",
        content: <span>Allocations</span>,
      },
    ];
    setTabs(tabs);
  }, [snapshotId]);

  if (loading && status === "loading" && !snapshot) {
    return <Spinner fullscreen />;
  }

  return (
    <>
      <ComponentCard
        title={
          <SnapshotDetailsTitle
            snapshotDate={snapshotDate}
            isActive={isActive}
            createdAt={createdAt}
            canGenerateSlots={true}
            onActivateSnapshot={onActivateSnapshot}
            onPublishSnapshot={onPublishSnapshot}
          />
        }
      >
        <SnapshotOverview isActive={isActive} summary={summary.data}></SnapshotOverview>
        {tabs && <Tabs tabsData={tabs} className="mt-4"></Tabs>}
      </ComponentCard>
    </>
  );
}
