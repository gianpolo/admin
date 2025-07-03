import ComponentCard from "../common/ComponentCard";
import Ribbon from "../common/Ribbon";
import Button from "../ui/button/Button";
import Badge from "../ui/badge/Badge";
import { CheckCircleIcon } from "../../icons";
export default function SnapshotOverview({ snapshot, label, isActive }) {
  const title = (
    <div className="flex relative items-center">
      <div className="flex-1 h-[32px]">{label}</div>
      {isActive ? (
        <Ribbon>active snapshot</Ribbon>
      ) : (
        <Button size="xs" variant="outline" endIcon={<CheckCircleIcon />}>
          Activate
        </Button>
      )}
    </div>
  );
  return (
    <ComponentCard
      title={title}
      className={`${
        isActive ? "border border-green-500!" : "border-transparent!"
      }`}
    >
      <>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7 2xl:gap-x-32">
          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              ID
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {snapshot.snapshotId}
            </p>
          </div>
          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Created At
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {snapshot.selfSchedulingId}
            </p>
          </div>
          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Snapshot Date
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {snapshot.snapshotDate}
            </p>
          </div>
          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              City ID
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {snapshot.cityId}
            </p>
          </div>
          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Total Tours
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              <Badge variant="solid" size="sm">
                {snapshot.tours.length}
              </Badge>
            </p>
          </div>
          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Tours Period
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {snapshot.toursPeriod.start} to {snapshot.toursPeriod.end}
            </p>
          </div>
        </div>
      </>
    </ComponentCard>
  );
}
