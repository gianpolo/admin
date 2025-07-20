import ComponentCard from "../../common/ComponentCard";
import CopyableText from "../../common/CopyableText";
import DateTime from "../../common/DateTime";
export default function SnapshotOverview({ snapshotSummary, isActive }) {
  const title = (
    <div className="flex relative items-center">
      <div className="flex-1 h-[32px]">{snapshotSummary.label}</div>
    </div>
  );
  const defaultClass = "border rounded-2xl dark:bg-transparent";
  const isActiveClass = isActive ? " border-green-500" : "border border-transparent";
  return (
    <ComponentCard title={title} className={`${defaultClass} ${isActiveClass}`}>
      <>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7 2xl:gap-x-32">
          <CopyableText text={snapshotSummary.snapshotId}>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">ID</p>
              <div className="text-xs font-medium text-gray-800 dark:text-white/90">
                <p>{snapshotSummary.snapshotId}</p>
              </div>
            </div>
          </CopyableText>
          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Created At</p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              <DateTime date={snapshotSummary.createdAt} />
            </p>
          </div>
          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Snapshot Date</p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              <DateTime date={snapshotSummary.snapshotDate} />
            </p>
          </div>
        </div>
      </>
    </ComponentCard>
  );
}
