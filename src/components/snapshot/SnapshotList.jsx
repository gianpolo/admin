import { useState, useEffect } from "react";
import Button from "../ui/button/Button.jsx";
import VerticalTabs from "../common/VerticalTabs.jsx";
import { CheckCircleIcon, PlusIcon } from "../../icons/index.js";
import SnapshotDetails from "./SnapshotDetails.jsx";
import Spinner from "../ui/spinner/Spinner.jsx";
import InputField from "../form/input/InputField.jsx";
import Label from "../form/Label.jsx";
export default function SnapshotList({
  snapshots,
  activeSnapshotId,
  onAddSnapshot,
  canAddSnapshot,
  loading,
  onActivateSnapshot,
  onGenerateSlots,
}) {
  const [tabsData, setTabsData] = useState(null);
  const [snapshotLabel, setSnapshotLabel] = useState("Generated from Dashboard");
  useEffect(() => {
    if (!snapshots?.length) return;

    const active = snapshots.find((s) => s.snapshotId === activeSnapshotId);
    // const others = snapshots.filter((s) => s.snapshotId !== activeSnapshotId);
    // const ordered = active ? [active, ...others] : snapshots;

    const tabs = snapshots.map((s) => {
      const isActive = s.snapshotId === activeSnapshotId;
      return {
        isActive,
        label: (
          <div className="flex flex-row w-full justify-between items-center">
            <div className="flex-auto text-left">
              <div className="text-sm">{s.snapshotDate}</div>
              <div className="text-xs">{s.label}</div>
              <div className="text-xs">{new Date(s.createdAt).toLocaleString()}</div>
            </div>
            {isActive && (
              <div className="text-right text-lg">
                <CheckCircleIcon className="success text-md" />
              </div>
            )}
          </div>
        ),
        content: (
          <SnapshotDetails
            loading={loading}
            onActivateSnapshot={() => onActivateSnapshot(s.snapshotId)}
            onGenerateSlots={() => onGenerateSlots(s.snapshotId)}
            isActive={isActive}
            snapshotId={s.snapshotId}
          />
        ),
      };
    });

    setTabsData(tabs);
  }, [snapshots, activeSnapshotId, loading]);

  const addOn = (
    <>
      <div className="border-b dark:border-gray-800">
        <div>
          <Label htmlFor="desc" className="  text-xs leading-normal text-gray-500 dark:text-gray-400">
            Snapshot Label
          </Label>
          <InputField
            disabled={loading}
            id="desc"
            className="text-xs  h-9!"
            value={snapshotLabel}
            onChange={(e) => setSnapshotLabel(e.target.value)}
          />
        </div>
        <Button
          size="sm"
          className="w-full mt-4"
          onClick={() => onAddSnapshot(snapshotLabel)}
          disabled={!canAddSnapshot || loading}
          startIcon={loading ? <Spinner size="xs" /> : <PlusIcon />}
        >
          Take a snapshot now
        </Button>
      </div>
    </>
  );
  return <>{tabsData && <VerticalTabs tabsData={tabsData} addOn={addOn}></VerticalTabs>}</>;
}
