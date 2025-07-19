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
  useEffect(() => {
    console.log("SnapshotDetails useEffect", snapshotId);
    if (snapshotId) {
      dispatch(fetchSnapshotDetails(snapshotId));
    }
  }, [snapshotId]);
  const dispatch = useDispatch();
  const [tabs, setTabs] = useState(null);
  const { details, status } = useSelector((state) => state.snapshots);
  const { snapshotSummary, tours } = details;
  const { snapshotDate } = snapshotSummary;
  useEffect(() => {
    console.log("SnapshotDetails useEffect - fetching details for snapshotId:", snapshotId);
    dispatch(fetchSnapshotDetails(snapshotId));
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
  }, [snapshotId]);

  if (loading && status === "loading") {
    return <Spinner fullscreen />;
  } else {
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
}
