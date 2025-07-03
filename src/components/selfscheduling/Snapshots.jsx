import ComponentCard from "../common/ComponentCard";
import Spinner from "../ui/spinner/Spinner.jsx";
import { useDispatch } from "react-redux";
import {
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

  const handleSnapshot = async (label) => {
    if (!selfSchedulingId) return;
    const result = await dispatch(
      createSnapshot({ selfSchedulingId, label })
    );
    if (createSnapshot.fulfilled.match(result)) {
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
          onAddSnapshot={handleSnapshot}
          canAddSnapshot={snapshotStatus !== "loading"}
        />
      )}
    </ComponentCard>
  );
}
