import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Button from "../../ui/button/Button.jsx";
import VerticalTabs from "../../common/VerticalTabs.jsx";
import { CheckCircleIcon, PlusIcon } from "../../../icons/index.js";
import SnapshotDetails from "../selectedSnapshot/SnapshotDetails.jsx";
import Spinner from "../../ui/spinner/Spinner.jsx";
import InputField from "../../form/input/InputField.jsx";
import Label from "../../form/Label.jsx";
import DateTime from "../../common/DateTime.jsx";
export default function SnapshotList({
  snapshots,
  selectedSnapshot,
  activeSnapshotId,
  onAddSnapshot,
  canAddSnapshot,
  loading,
  onActivateSnapshot,
  onGenerateItems,
  onSnapshotSelected,
}) {
  const [tabsData, setTabsData] = useState(null);
  const [snapshotLabel, setSnapshotLabel] = useState("Generated from Dashboard");
  var elementPos = snapshots
    .map(function (x) {
      return x.snapshotId;
    })
    .indexOf(selectedSnapshot);
  const [currentTabIndex, setCurrentTabIndex] = useState(elementPos || 0);
  useEffect(() => {
    if (!snapshots?.length) return;
    const tabs = snapshots.map((s) => {
      const { snapshotDate, label, createdAt } = s;
      const isActive = s.snapshotId === activeSnapshotId;
      return {
        isActive,
        label: (
          <div className="flex flex-row w-full justify-between items-center">
            <div className="flex-auto text-left">
              <div className="text-theme-sm mb-2">
                <DateTime date={snapshotDate} />
                <span className="ml-1">- {label}</span>
              </div>
              <div className="text-theme-xs">
                <DateTime date={createdAt} />
              </div>
              <div className="text-theme-xs">{s.snapshotId}</div>
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
            onGenerateItems={() => onGenerateItems(s.snapshotId)}
            isActive={isActive}
            snapshotId={selectedSnapshot}
          />
        ),
      };
    });
    setTabsData(tabs);
  }, [activeSnapshotId, loading]);

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
  return (
    <>
      {tabsData && !loading && (
        <VerticalTabs
          currentTabIndex={currentTabIndex}
          tabsData={tabsData}
          addOn={addOn}
          onChangeTab={onSnapshotSelected}
        ></VerticalTabs>
      )}
    </>
  );
}
