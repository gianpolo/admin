import DateTime from "../common/DateTime.jsx";
import { CheckCircleIcon } from "../../icons/index.js";

export default function SnapshotList({ snapshotList, selectedSnapshotId, activeSnapshotId, onSnapshotSelected }) {
  if (!snapshotList || snapshotList.length === 0) return null;

  return (
    <div className="mb-4 space-y-2">
      {snapshotList.map((s) => {
        const isSelected = s.snapshotId === selectedSnapshotId;
        const isActive = s.snapshotId === activeSnapshotId;
        return (
          <div key={s.snapshotId} className="flex flex-row w-full justify-between items-center">
            <div className="flex-auto text-left">
              <div className="text-theme-sm mb-2">
                <DateTime date={s.snapshotDate} />
                <span className="ml-1">- {s.label}</span>
              </div>
              <div className="text-theme-xs">
                <DateTime date={s.createdAt} />
              </div>
              <div className="text-theme-xs">{s.snapshotId}</div>
            </div>
            {isActive && (
              <div className="text-right text-lg">
                <CheckCircleIcon className="success text-md" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
