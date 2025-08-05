import { useState, useEffect } from "react";
import ComponentCard from "../common/ComponentCard";
import { useDispatch } from "react-redux";
import { activateSnapshot, createSnapshot, processSnapshot, publishSnapshot } from "../../store/snapshotsSlice.js";
import { generateSlots } from "../../store/slotsSlice.js";
import { fetchSchedulingPlanDetails } from "../../store/planDetailsSlice.js";
import EmptySnapshotWidget from "./EmptySnapshotWidget.jsx";
import SnapshotList from "./list/SnapshotList.jsx";

export default function SnapshotsContainer({ snapshotList, activeSnapshotId, snapshotStatus, schedulingPlanId }) {
  const dispatch = useDispatch();
  const [selectedSnapshot, setSelectedSnasphot] = useState(activeSnapshotId || null);
  // Keep selected snapshot in sync with active snapshot id
  useEffect(() => {
    console.log("SnapshotsContainer effect setSelectedSnasphot");
    setSelectedSnasphot(activeSnapshotId || null);
  }, [activeSnapshotId]);

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
            snapshots={snapshotList}
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
