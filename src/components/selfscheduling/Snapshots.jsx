import ComponentCard from "../common/ComponentCard";
import { useDispatch } from "react-redux";
import {
  activateSnapshot,
  createSnapshot,
  fetchSelfSchedulingDetails,
} from "../../store/selfschedulingDetailsSlice.js";

import SnapshotList from "./SnapshotList.jsx";
export default function Snapshots({
  snapshots,
  activeSnapshotId,
  snapshotStatus,
  selfSchedulingId,
}) {
  const dispatch = useDispatch();

  const handleAddSnapshot = async (label) => {
    if (!selfSchedulingId) return;
    const result = await dispatch(createSnapshot({ selfSchedulingId, label }));
    if (createSnapshot.fulfilled.match(result)) {
      dispatch(fetchSelfSchedulingDetails(selfSchedulingId));
    }
  };
  const handleActivateSnapshot = async (snapshotId) => {
    if (!selfSchedulingId) return;
    const result = await dispatch(
      activateSnapshot({ selfSchedulingId, snapshotId })
    );
    if (activateSnapshot.fulfilled.match(result)) {
      dispatch(fetchSelfSchedulingDetails(selfSchedulingId));
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
      {snapshots && (
        <SnapshotList
          loading={snapshotStatus === "loading"}
          snapshots={snapshots}
          activeSnapshotId={activeSnapshotId}
          onAddSnapshot={handleAddSnapshot}
          onActivateSnapshot={handleActivateSnapshot}
          canAddSnapshot={snapshotStatus !== "loading"}
        />
      )}
    </ComponentCard>
  );
}
