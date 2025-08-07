import DateTime from "../common/DateTime";
import MoreMenu from "../common/MoreMenu";
import CopyableText from "../common/CopyableText";
export default function SnapshotDetailsTitle({ summary, takenAt, isActive, onActivateSnapshot, canActivate }) {
  if (!summary || !summary.data) return <></>;
  const { snapshotDate, snapshotId, label } = summary.data;

  return (
    <>
      <div className="flex justify-between">
        <div className="">
          <h4 className="text-lg font-semibold mr-10">{label}</h4>
          <div>
            <p>
              <span className=" text-gray-500 text-theme-sm dark:text-gray-400">Tours and Forecasting data at:</span>{" "}
              <span className="">{snapshotDate && <DateTime date={snapshotDate} />}</span>
            </p>
          </div>
        </div>
        <MoreMenu menuItems={[{ label: "Activate", action: onActivateSnapshot, disabled: isActive || !canActivate }]} />
      </div>

      <div className="flex text-theme-xs mt-5">
        <div>
          <CopyableText text={snapshotId}>
            <div className=" leading-normal text-gray-500 dark:text-gray-400">Snapshot ID</div>
            <div className=" text-gray-800 dark:text-white/90 pointer">
              <div>{snapshotId}</div>
            </div>
          </CopyableText>
        </div>
        <div className="ml-10">
          <span className=" text-gray-500">Snapshot Taken At</span>
          <div className="">{takenAt && <DateTime size="sm" date={takenAt} />}</div>
        </div>
      </div>
    </>
  );
}
