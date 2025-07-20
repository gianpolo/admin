import DateTime from "../../common/DateTime";
import MoreMenu from "../../common/MoreMenu";
export default function SnapshotDetailsTitle({ snapshotDate, isActive, onActivateSnapshot, onGenerateItems }) {
  return (
    <div className="flex justify-between">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Snapshot Details</h3>
        <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
          Tours and Forecasting data at: {snapshotDate && <DateTime date={snapshotDate} />}
        </p>
      </div>
      <MoreMenu
        menuItems={[
          { label: "Activate", action: onActivateSnapshot, disabled: !isActive },
          { label: "Generate Items", action: onGenerateItems },
        ]}
      />
    </div>
  );
}
