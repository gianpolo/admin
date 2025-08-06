import DateTime from "../common/DateTime.jsx";
import { CheckCircleIcon } from "../../icons/index.js";
export default function SnapshotListItem({ snapshot, isActive }) {
  if (!snapshot) return null;
  return (
    <div className="flex flex-row w-full justify-between items-center">
      <div className="flex-auto text-left">
        <div className="text-theme-sm mb-2">
          <DateTime date={snapshot.snapshotDate} />
          <span className="ml-1">- {snapshot.label}</span>
        </div>
        <div className="text-theme-xs">
          <DateTime date={snapshot.createdAt} />
        </div>
        <div className="text-theme-xs">{snapshot.snapshotId}</div>
      </div>
      {isActive && (
        <div className="text-right text-lg">
          <CheckCircleIcon className="success text-md" />
        </div>
      )}
    </div>
  );
}
