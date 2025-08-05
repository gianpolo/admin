import { useState, useEffect } from "react";
import ComponentCard from "../common/ComponentCard";
import { useDispatch } from "react-redux";
import { activateSnapshot, createSnapshot, processSnapshot, publishSnapshot } from "../../store/snapshotsSlice.js";
import { fetchSchedulingPlanDetails } from "../../store/planDetailsSlice.js";
import EmptySnapshotWidget from "./EmptySnapshotWidget.jsx";
import SnapshotList from "./list/SnapshotList.jsx";

export default function SnapshotsContainer({ snapshotList, activeSnapshotId }) {
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


  const handleAddSnapshot = async (label) => {
    if (!schedulingPlanId) return;
    const result = await dispatch(createSnapshot({ schedulingPlanId, label }));
    if (createSnapshot.fulfilled.match(result)) {
      dispatch(fetchSchedulingPlanDetails(schedulingPlanId));
    }
  };
  const handleActivateSnapshot = async (snapshotId) => {
    if (!schedulingPlanId) return;
    const result = await dispatch(activateSnapshot({ schedulingPlanId, snapshotId }));
    if (activateSnapshot.fulfilled.match(result)) {
      dispatch(fetchSchedulingPlanDetails(schedulingPlanId));
    }
  };

  const handlePublishSnapshot = async (snapshotId) => {
    if (!snapshotId) return;
    const result = await dispatch(publishSnapshot(snapshotId));
    if (processSnapshot.fulfilled.match(result)) {
      dispatch(fetchSchedulingPlanDetails(schedulingPlanId));
    }
  };
  return (
    <ComponentCard
      title={
        <div className="flex items-center">
          <div className="flex flex-auto">Nbo and legacy data Snapshots</div>
        </div>
      }
    >
      {snapshotList &&
        (snapshotList.length === 0 ? (
          <EmptySnapshotWidget onAddSnapshot={handleAddSnapshot} />
        ) : (
          <SnapshotList
            loading={snapshotStatus === "loading"}
            snapshotList={snapshotList}
            activeSnapshotId={activeSnapshotId}
            selectedSnapshot={selectedSnapshot}
            onSnapshotSelected={(id) => {
              console.log("onSnapshotSelecte");
              setSelectedSnasphot(id);
            }}
            onAddSnapshot={handleAddSnapshot}
            onActivateSnapshot={handleActivateSnapshot}
            canAddSnapshot={snapshotStatus !== "loading"}
            onPublishSnapshot={handlePublishSnapshot}
          />
        ))}
    </ComponentCard>
  );
}
