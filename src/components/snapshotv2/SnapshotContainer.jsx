import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ComponentCard from "../common/ComponentCard.jsx";
import Tabs from "../common/Tabs.jsx";
import SnapshotList from "./SnapshotList.jsx";
import SnapshotDetails from "./SnapshotDetails.jsx";
import ExperiencesSnapshots from "./tabs/ExperiencesSnapshots.jsx";
import ForecastsSnapshots from "./tabs/ForecastsSnapshots.jsx";
import AudienceSnapshots from "./tabs/AudienceSnapshots.jsx";
import AllocationsSnapshots from "./tabs/AllocationsSnapshots.jsx";
import {
  fetchSnapshotMeta,
  fetchExperiencesSnapshots,
  fetchForecastsSnapshots,
  fetchAudienceSnapshots,
  fetchAllocationsSnapshots,
} from "../../store/snapshotsSlice.js";

export default function SnapshotContainer({ snapshotList, activeSnapshotId }) {
  const dispatch = useDispatch();
  const { details } = useSelector((state) => state.snapshots);
  const [selectedSnapshotId, setSelectedSnapshotId] = useState(
    activeSnapshotId || (snapshotList && snapshotList.length > 0 ? snapshotList[0].snapshotId : null)
  );

  useEffect(() => {
    if (!selectedSnapshotId) return;
    dispatch(fetchSnapshotMeta(selectedSnapshotId));
    dispatch(fetchExperiencesSnapshots(selectedSnapshotId));
  }, [selectedSnapshotId, dispatch]);

  const snapshotDetail = selectedSnapshotId && details[selectedSnapshotId] ? details[selectedSnapshotId] : null;
  const summary = snapshotDetail ? snapshotDetail.summary.data : null;

  const tabs = [
    {
      label: "Experiences",
      content: <ExperiencesSnapshots snapshotId={selectedSnapshotId} />,
      onTabActive: () => dispatch(fetchExperiencesSnapshots(selectedSnapshotId)),
    },
    {
      label: "Forecasting",
      content: <ForecastsSnapshots snapshotId={selectedSnapshotId} />,
      onTabActive: () => dispatch(fetchForecastsSnapshots(selectedSnapshotId)),
    },
    {
      label: "Audience",
      content: <AudienceSnapshots snapshotId={selectedSnapshotId} />,
      onTabActive: () => dispatch(fetchAudienceSnapshots(selectedSnapshotId)),
    },
    {
      label: "Allocations",
      content: <AllocationsSnapshots snapshotId={selectedSnapshotId} />,
      onTabActive: () => dispatch(fetchAllocationsSnapshots(selectedSnapshotId)),
    },
  ];

  return (
    <ComponentCard title="Snapshots">
      {snapshotList && snapshotList.length > 0 && (
        <SnapshotList
          snapshotList={snapshotList}
          activeSnapshotId={activeSnapshotId}
          selectedSnapshotId={selectedSnapshotId}
          onSnapshotSelected={(id) => {
            setSelectedSnapshotId(id);
          }}
        />
      )}
      {summary && (
        <>
          <SnapshotDetails summary={summary} isActive={selectedSnapshotId === activeSnapshotId} />
          <Tabs tabsData={tabs} activeTab={0} key={selectedSnapshotId} />
        </>
      )}
    </ComponentCard>
  );
}
