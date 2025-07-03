 
import ComponentCard from "../common/ComponentCard"; 
import Spinner from "../ui/spinner/Spinner.jsx";
import { useDispatch } from "react-redux";
import { createSnapshot } from "../../store/selfschedulingDetailsSlice.js";

import SnapshotList from "./SnapshotList.jsx";
export default function Snapshots({
  snapshots,
  activeSnapshotId,
  snapshotStatus,
  selfschedulingId,
}) {
  const dispatch = useDispatch();

  const handleSnapshot = () => {
    if (!selfschedulingId) return;
    dispatch(createSnapshot(selfschedulingId));
  }; 
  return (
    <ComponentCard
      title={
        <div className="flex items-center">
          <div className="flex flex-auto">Forecasting and Tours Snapshots</div>
          <div>
            {snapshotStatus === "loading" ? <Spinner fullscreen /> : <></>}
          </div>
        </div>
      }
    >
      {snapshots && (
        <SnapshotList
          snapshots={snapshots}
          activeSnapshotId={activeSnapshotId}
          onAddSnapshot={handleSnapshot}
          canAddSnapshot={snapshotStatus !== "loading"}
        />
      )}
    </ComponentCard>
  );
}
