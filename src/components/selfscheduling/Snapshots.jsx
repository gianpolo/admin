import { useState, useEffect } from "react";
import ComponentCard from "../common/ComponentCard";
import { Tabs } from "../common/Tabs";
import Button from "../ui/button/Button.jsx";
import Spinner from "../ui/spinner/Spinner.jsx";
import { useDispatch, useSelector } from "react-redux";
import { createSnapshot } from "../../store/selfschedulingDetailsSlice.js";

export default function Snapshots({ selfschedulingId }) {
  const dispatch = useDispatch();
  const { snapshotStatus, snapshots } = useSelector(
    (state) => state.selfschedulingsDetails
  );
  const handleSnapshot = () => {
    if (!selfschedulingId) return;
    dispatch(createSnapshot(selfschedulingId));
  };
  const [tabsData, setTabsData] = useState();

  useEffect(() => {
    if (snapshots && snapshots.length > 0) {
      const tabs = snapshots.map((s) => ({
        label: s.snapshotDate,
        content: (
          <div>
            <div>{s.label}</div>
            <div>{s.snapshotId}</div>
          </div>
        ),
      }));
      setTabsData(tabs);
    }
  }, [snapshots]);
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
      {tabsData && <Tabs tabsData={tabsData}></Tabs>}
    </ComponentCard>
  );
}
