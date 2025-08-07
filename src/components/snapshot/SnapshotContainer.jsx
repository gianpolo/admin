import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ComponentCard from "../common/ComponentCard.jsx";
import SnapshotDetails from "./SnapshotDetails.jsx";
import { fetchSnapshotMeta, fetchExperiencesSnapshots } from "../../store/snapshotsSlice.js";
import VerticalTabs from "../common/VerticalTabs.jsx";
import SnapshotListAddOn from "./SnapshotListAddOn.jsx";
import EmptySnapshotWidget from "./EmptySnapshotWidget.jsx";
import SnapshotListItem from "./SnapshotListItem.jsx";
export default function SnapshotContainer({
  snapshotList,
  activeSnapshotId,
  onAddSnapshot,
  onActivateSnapshot,
  canAddSnapshot,
}) {
  const dispatch = useDispatch();
  const { details } = useSelector((state) => state.snapshots);

  const [currentAction, setCurrentAction] = useState(() => (id) => fetchExperiencesSnapshots(id));

  const [selectedSnapshotId, setSelectedSnapshotId] = useState(
    activeSnapshotId || (snapshotList && snapshotList.length > 0 ? snapshotList[0].snapshotId : null)
  );

  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  useEffect(() => {
    if (!selectedSnapshotId) return;
    dispatch(fetchSnapshotMeta(selectedSnapshotId));
    dispatch(currentAction(selectedSnapshotId));
  }, [selectedSnapshotId, dispatch]);

  const snapshotDetail = selectedSnapshotId && details[selectedSnapshotId] ? details[selectedSnapshotId] : null;

  const handleDetailTabChange = (action) => {
    dispatch(action(selectedSnapshotId));
    setCurrentAction(() => action);
  };

  const handleSnapshotSelection = (idx) => {
    setCurrentTabIndex(idx);
    setSelectedSnapshotId(snapshotList[idx].snapshotId);
  };

  const [snapshotLabel, setSnapshotLabel] = useState("Generated from Dashboard");

  const snapshotsTabs = (snapshotList || []).map((s) => ({
    label: <SnapshotListItem snapshot={s} isActive={s.snapshotId === activeSnapshotId} />,
    content: (
      <SnapshotDetails
        takenAt={s.createdAt}
        snapshotDetail={snapshotDetail}
        isActive={s.snapshotId === activeSnapshotId}
        onActivateSnapshot={() => onActivateSnapshot(s.snapshotId)} 
        onChangeTab={handleDetailTabChange}
        canActivate={canAddSnapshot}
      />
    ),
  }));

  const emptyContent = <EmptySnapshotWidget onAddSnapshot={onAddSnapshot} />;
  const snapshotsVerticalTabs = (
    <VerticalTabs
      currentTabIndex={currentTabIndex}
      tabsData={snapshotsTabs}
      addOn={
        canAddSnapshot && (
          <SnapshotListAddOn
            snapshotLabel={snapshotLabel}
            setSnapshotLabel={setSnapshotLabel}
            onAddSnapshot={onAddSnapshot}
            canAddSnapshot={canAddSnapshot}
          />
        )
      }
      onChangeTab={handleSnapshotSelection}
    ></VerticalTabs>
  );

  return (
    <ComponentCard
      title={
        <div className="flex items-center">
          <div className="flex flex-auto">Nbo and legacy data Snapshots</div>
        </div>
      }
    >
      {!snapshotList || snapshotList.length === 0 ? emptyContent : snapshotsVerticalTabs}
    </ComponentCard>
  );
}
