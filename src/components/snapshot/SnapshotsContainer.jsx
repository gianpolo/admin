import { useState, useEffect } from "react";
import ComponentCard from "../common/ComponentCard";
import { useDispatch, useSelector } from "react-redux";
import { activateSnapshot, createSnapshot, processSnapshot, fetchTourSnapshots } from "../../store/snapshotsSlice.js";
import { generateSlots } from "../../store/slotsSlice.js";
import { fetchSelfschedulingDetails } from "../../store/selfschedulingDetailsSlice.js";
import EmptySnapshotWidget from "./EmptySnapshotWidget.jsx";
import SnapshotList from "./list/SnapshotList.jsx";

export default function SnapshotsContainer({ snapshotList, activeSnapshotId, snapshotStatus, selfSchedulingId }) {
  const dispatch = useDispatch();
  const [selectedSnapshot, setSelectedSnasphot] = useState(activeSnapshotId || null);

  // Keep selected snapshot in sync with active snapshot id
  useEffect(() => {
    setSelectedSnasphot(activeSnapshotId || null);
  }, [activeSnapshotId]);

  // Fetch tours for the currently selected snapshot if not loaded yet
  const tours = useSelector((state) =>
    selectedSnapshot ? state.snapshots.details[selectedSnapshot]?.tours : null
  );
  const status = useSelector((state) => state.snapshots.status);
  useEffect(() => {
    if (selectedSnapshot && !tours && status !== "loading") {
      dispatch(fetchTourSnapshots(selectedSnapshot));
    }
  }, [dispatch, selectedSnapshot, tours, status]);
  const handleAddSnapshot = async (label) => {
    if (!selfSchedulingId) return;
    const result = await dispatch(createSnapshot({ selfSchedulingId, label }));
    if (createSnapshot.fulfilled.match(result)) {
      dispatch(fetchSelfschedulingDetails(selfSchedulingId));
    }
  };
  const handleActivateSnapshot = async (snapshotId) => {
    if (!selfSchedulingId) return;
    const result = await dispatch(activateSnapshot({ selfSchedulingId, snapshotId }));
    if (activateSnapshot.fulfilled.match(result)) {
      dispatch(fetchSelfschedulingDetails(selfSchedulingId));
    }
  };
  const handleGenerateSlots = async (snapshotId) => {
    if (!snapshotId) return;
    const result = await dispatch(generateSlots(snapshotId));
    if (generateSlots.fulfilled.match(result)) {
      dispatch(fetchSelfschedulingDetails(selfSchedulingId));
    }
  };
  const handleGenerateItems = async (snapshotId) => {
    if (!snapshotId) return;
    const result = await dispatch(processSnapshot(snapshotId));
    if (processSnapshot.fulfilled.match(result)) {
      dispatch(fetchSelfschedulingDetails(selfSchedulingId));
    }
  };
  return (
    <ComponentCard
      title={
        <div className="flex items-center">
          <div className="flex flex-auto">Forecasting and Tours Snapshots</div>
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
            onSnapshotSelected={(id) => setSelectedSnasphot(id)}
            onAddSnapshot={handleAddSnapshot}
            onActivateSnapshot={handleActivateSnapshot}
            onGenerateSlots={handleGenerateSlots}
            onGenerateItems={handleGenerateItems}
            canAddSnapshot={snapshotStatus !== "loading"}
          />
        ))}
    </ComponentCard>
  );
}
