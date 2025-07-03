import { useState, useEffect } from "react";
import Button from "../ui/button/Button.jsx";
import VerticalTabs from "../common/VerticalTabs.jsx"; 
import { CheckCircleIcon, PlusIcon } from "../../icons";
import Snapshot from "./Snapshot.jsx";
export default function SnapshotList({
  snapshots,
  activeSnapshotId,
  onAddSnapshot,
  canAddSnapshot,
}) {
  const [tabsData, setTabsData] = useState(null);
  useEffect(() => {
    if (!snapshots?.length) return;

    const active = snapshots.find((s) => s.snapshotId === activeSnapshotId);
    const others = snapshots.filter((s) => s.snapshotId !== activeSnapshotId);
    const ordered = active ? [active, ...others] : snapshots;

    const tabs = ordered.map((s) => {
      const isActive = s.snapshotId === activeSnapshotId;
      return {
        isActive,
        label: (
          <div className="flex flex-row w-full justify-between items-center">
            <div className="flex-auto text-left">{s.snapshotDate}</div>
            {isActive && (
              <div className="text-right text-lg">
                <CheckCircleIcon className="success text-md" />
              </div>
            )}
          </div>
        ),
        content: (
          <Snapshot
            isActive={isActive}
            snapshotId={s.snapshotId}
            label={s.snapshotDate}
          />
        ),
      };
    });

    setTabsData(tabs);
  }, [snapshots, activeSnapshotId]);

  const addOn = (
    <div className="border-b dark:border-gray-800">
      <Button
        size="sm"
        variant="outline"
        className="w-full"
        onClick={() => onAddSnapshot}
        disabled={!canAddSnapshot}
        startIcon={<PlusIcon/>}
      >
        Take a snapshot now
      </Button>
    </div>
  );
  return (
    <>
      {tabsData && (
        <VerticalTabs tabsData={tabsData} addOn={addOn}></VerticalTabs>
      )}
    </>
  );
}
