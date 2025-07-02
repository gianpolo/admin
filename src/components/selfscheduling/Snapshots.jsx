import ComponentCard from "../common/ComponentCard";
import { Tabs } from "../common/Tabs";
import Button from "../ui/button/Button.jsx";
import Spinner from "../ui/spinner/Spinner.jsx";
import { useDispatch, useSelector } from "react-redux";
import { createSnapshot } from "../../store/selfschedulingDetailsSlice.js";

export default function Snapshots({ snapshots, selfschedulingId }) {
  const dispatch = useDispatch();
  const { snapshotStatus } = useSelector((state) => state.selfschedulingsDetails);

  const handleSnapshot = () => {
    if (!selfschedulingId) return;
    dispatch(createSnapshot(selfschedulingId));
  };

  return (
    <ComponentCard
      title={
        <div className="flex items-center">
          <div className="flex flex-auto">Snapshots</div>
          <div>
            <Button
              size="sm"
              onClick={handleSnapshot}
              disabled={snapshotStatus === "loading"}
            >
              {snapshotStatus === "loading" ? <Spinner /> : "Take snapshot"}
            </Button>
          </div>
        </div>
      }
    >
      <Tabs></Tabs>
    </ComponentCard>
  );
}
