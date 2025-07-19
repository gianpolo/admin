import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSnapshotDetails } from "../../../store/snapshotsSlice.js";
import SnapshotOverview from "./SnapshotOverview.jsx";
import Spinner from "../../ui/spinner/Spinner.jsx";
import ComponentCard from "../../common/ComponentCard.jsx";
import TourSnapshots from "./tabs/TourSnapshots.jsx";
import ForecastSnapshots from "./tabs/ForecastSnapshots.jsx";
import SnapshotDetailsTitle from "./SnapshotDetailsTitle.jsx";
import Tabs from "../../common/Tabs.jsx";

export default function SnapshotDetails({ snapshotId, isActive, loading, onActivateSnapshot, onGenerateSlots }) {
  const dispatch = useDispatch();
  const [tabs, setTabs] = useState(null);
  const { details, status } = useSelector((state) => state.snapshots);
  const snapshotData = details ? details[snapshotId] : null;

  useEffect(() => {
    if (snapshotId) {
      dispatch(fetchSnapshotDetails(snapshotId));
    }
  }, [snapshotId, dispatch]);

  useEffect(() => {
    if (!snapshotData) return;
    const { tours } = snapshotData;
    const tabs = [
      {
        label: "Tours",
        content: <TourSnapshots tours={tours} />,
      },
      {
        label: "Forecasting",
        content: <ForecastSnapshots tours={tours} />,
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
  }, [snapshotData]);

  if (loading && status === "loading" && !snapshotData) {
    return <Spinner fullscreen />;
  }

  if (!snapshotData) return null;

  const { snapshotSummary } = snapshotData;
  const { snapshotDate } = snapshotSummary;

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
            onGenerateSlots={onGenerateSlots}
          />
        }
      >
        <SnapshotOverview isActive={isActive} snapshotSummary={snapshotSummary}></SnapshotOverview>
        {tabs && <Tabs tabsData={tabs} className="mt-4"></Tabs>}
      </ComponentCard>
    </>
  );
}
