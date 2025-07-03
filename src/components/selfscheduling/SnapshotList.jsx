import { useState, useEffect, useRef } from "react";
import Button from "../ui/button/Button.jsx";
// We'll implement our own simple vertical tabs to allow animations
import { CheckCircleIcon, PlusIcon } from "../../icons";
import Snapshot from "./Snapshot.jsx";
import Spinner from "../ui/spinner/Spinner.jsx";
import InputField from "../../components/form/input/InputField.jsx";
import Label from "../../components/form/Label.jsx";
export default function SnapshotList({
  snapshots,
  activeSnapshotId,
  previousActiveId,
  onAddSnapshot,
  canAddSnapshot,
  loading,
  onActivateSnapshot,
}) {
  const [tabsData, setTabsData] = useState(null);
  const [highlightId, setHighlightId] = useState(null);
  const [slideInfo, setSlideInfo] = useState({ id: null, distance: 0 });
  const itemRefs = useRef({});
  const prevSnapshotsRef = useRef([]);
  const getItemRef = (id) => (el) => {
    if (el) itemRefs.current[id] = el;
  };
  const [snapshotLabel, setSnapshotLabel] = useState(
    "Generated from Dashboard"
  );

  // compute animation and highlight when snapshots or active id change
  useEffect(() => {
    if (prevSnapshotsRef.current.length && activeSnapshotId) {
      const prevIndex = prevSnapshotsRef.current.findIndex(
        (s) => s.snapshotId === activeSnapshotId
      );
      if (prevIndex > 0) {
        const itemHeight =
          itemRefs.current[activeSnapshotId]?.offsetHeight || 60;
        setSlideInfo({ id: activeSnapshotId, distance: prevIndex * itemHeight });
      } else {
        setSlideInfo({ id: null, distance: 0 });
      }
    }
    if (previousActiveId) {
      setHighlightId(previousActiveId);
    }

    const active = snapshots.find((s) => s.snapshotId === activeSnapshotId);
    const others = snapshots.filter((s) => s.snapshotId !== activeSnapshotId);
    const ordered = active ? [active, ...others] : snapshots;

    const tabs = ordered.map((s) => {
      const isActive = s.snapshotId === activeSnapshotId;
      const isPrev = s.snapshotId === highlightId;
      const slideStyle =
        isActive && slideInfo.id === s.snapshotId
          ? { "--slide-distance": `${slideInfo.distance}px` }
          : {};
      return {
        key: s.snapshotId,
        isActive,
        isPrev,
        slideStyle,
        label: (
          <div className="flex flex-row w-full justify-between items-center">
            <div className="flex-auto text-left">
              <div>{s.snapshotDate}</div>
              <div className="text-xs">{s.label}</div>
            </div>
            {isActive && (
              <div className="text-right text-lg">
                <CheckCircleIcon className="success text-md" />
              </div>
            )}
          </div>
        ),
        content: (
          <Snapshot
            loading={loading}
            onActivateSnapshot={() => onActivateSnapshot(s.snapshotId)}
            isActive={isActive}
            snapshotId={s.snapshotId}
            label={s.snapshotDate}
          />
        ),
      };
    });

    setTabsData(tabs);
    prevSnapshotsRef.current = snapshots;
    if (previousActiveId) {
      const t = setTimeout(() => setHighlightId(null), 2000);
      return () => clearTimeout(t);
    }
  }, [snapshots, activeSnapshotId, loading, previousActiveId]);

  const addOn = (
    <>
      <div className="border-b dark:border-gray-800">
        <div>
          <Label
            htmlFor="desc"
            className="  text-xs leading-normal text-gray-500 dark:text-gray-400"
          >
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
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  useEffect(() => {
    setActiveTabIndex(0);
  }, [tabsData]);

  return (
    <>
      {tabsData && (
        <div className="flex flex-col gap-6 sm:flex-row sm:gap-8 rounded-xl">
          <div className="sm:w-[300px] rounded-xl p-6 dark:bg-white/[0.03]">
            <div className="pb-6 mb-6 border-b border-gray-700">{addOn}</div>
            <nav className="flex flex-auto sm:flex-col sm:space-y-2 overflow-y-auto">
              {tabsData.map((tab, idx) => (
                <button
                  key={tab.key}
                  ref={getItemRef(tab.key)}
                  style={tab.slideStyle}
                  className={`inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 ease-in-out sm:p-3 ${
                    idx === activeTabIndex
                      ? " text-brand-500 dark:bg-brand-400/20 dark:text-brand-400 bg-brand-50"
                      : "py-2.5  bg-transparent text-gray-500 border-transparent hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  } ${tab.isPrev ? "bg-gray-100 dark:bg-gray-800" : ""} ${
                    tab.isActive && slideInfo.id === tab.key ? "move-top" : ""
                  }`}
                  onClick={() => setActiveTabIndex(idx)}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex-1">
            <div className="h-full w-full text-sm text-gray-500 dark:text-gray-400">
              {tabsData[activeTabIndex].content}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
