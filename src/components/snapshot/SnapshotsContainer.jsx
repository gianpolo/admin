import ComponentCard from "../common/ComponentCard.jsx";
import { useDispatch } from "react-redux";
import { activateSnapshot, createSnapshot } from "../../store/snapshotsSlice.js";
import { generateSlots } from "../../store/slotsSlice.js";
import { fetchSelfschedulingDetails } from "../../store/selfschedulingDetailsSlice.js";
import EmptySnapshot from "./EmptySnapshot.jsx";
import SnapshotList from "./SnapshotList.jsx";

export default function SnapshotsContainer({ snapshots, activeSnapshotId, snapshotStatus, selfSchedulingId }) {
  const dispatch = useDispatch();
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
      dispatch(fetchSelfSchedulingDetails(selfSchedulingId));
    }
  };
  const handleGenerateSlots = async (snapshotId) => {
    if (!selfSchedulingId) return;
    const result = await dispatch(generateSlots(snapshotId));
    if (generateSlots.fulfilled.match(result)) {
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
      {snapshots &&
        (snapshots.length === 0 ? (
          <EmptySnapshot onAddSnapshot={handleAddSnapshot} />
        ) : (
          <SnapshotList
            loading={snapshotStatus === "loading"}
            snapshots={snapshots.list}
            activeSnapshotId={activeSnapshotId}
            onAddSnapshot={handleAddSnapshot}
            onActivateSnapshot={handleActivateSnapshot}
            onGenerateSlots={handleGenerateSlots}
            canAddSnapshot={snapshotStatus !== "loading"}
          />
        ))}
    </ComponentCard>
  );
}
