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

export default function SnapshotDetails({ snapshotId, isActive, loading, onActivateSnapshot, onGenerateItems }) {
  const [tabs, setTabs] = useState(null);
  const { details, status } = useSelector((state) => state.snapshots);
  const snapshot = details ? details[snapshotId] : null;
  const { tours, snapshotSummary } = snapshot;
  const { snapshotDate } = snapshotSummary;

  useEffect(() => {
    const tabs = [
      {
        label: "Tours",
        content: <TourSnapshots snapshotId={snapshotId} />,
      },
      // {
      //   label: "Forecasting",
      //   content: <ForecastSnapshots tours={tours} />,
      // },
      // {
      //   label: "Items",
      //   content: <SelfSchedulingItems snapshotId={snapshotId} />,
      // },
      // {
      //   label: "Guides",
      //   content: <span>Guides</span>,
      // },
      // {
      //   label: "Allocations",
      //   content: <span>Allocations</span>,
      // },
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
            createdAt={snapshotSummary.createdAt}
            canGenerateSlots={true}
            onActivateSnapshot={onActivateSnapshot}
            onGenerateItems={onGenerateItems}
          />
        }
      >
        <SnapshotOverview isActive={isActive} snapshotSummary={snapshotSummary}></SnapshotOverview>
        {tabs && <Tabs tabsData={tabs} className="mt-4"></Tabs>}
      </ComponentCard>
    </>
  );
}
