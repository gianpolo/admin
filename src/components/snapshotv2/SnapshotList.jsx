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
          <button
            key={s.snapshotId}
            onClick={() => onSnapshotSelected(s.snapshotId)}
            className={`w-full text-left p-2 rounded-lg border transition-colors duration-200 ${
              isSelected
                ? "border-brand-500 bg-brand-50 dark:bg-brand-400/20"
                : "border-transparent hover:bg-gray-50 dark:hover:bg-white/[0.05]"
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="text-theme-sm">
                  <DateTime date={s.snapshotDate} /> <span className="ml-1">- {s.label}</span>
                </div>
                <div className="text-theme-xs">
                  <DateTime date={s.createdAt} />
                </div>
                <div className="text-theme-xs">{s.snapshotId}</div>
              </div>
              {isActive && <CheckCircleIcon className="text-brand-500" />}
            </div>
          </button>
        );
      })}
    </div>
  );
}
