import Button from "../ui/button/Button.jsx";
import Badge from "../ui/badge/Badge.jsx";
import { PlayIcon, StopIconCircle } from "../../icons/index.js";
import Spinner from "../ui/spinner/Spinner.jsx";
export default function SelfSchedulingInfoCard({
  selfscheduling,
  onAction,
  actionLoading = false,
}) {
  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Overview
            </h4>
          </div>

          <div className="flex flex-wrap gap-2">
            {actionLoading && <Spinner />}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7 2xl:gap-x-32">
          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Id
            </p>
            <p className="text-xs font-medium text-gray-800 dark:text-white/90">
              {selfscheduling.selfSchedulingId}
            </p>
          </div>
          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Tours Period
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {selfscheduling.configuration.toursPeriod.start} to{" "}
              {selfscheduling.configuration.toursPeriod.end}
            </p>
          </div>

          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Experiences Count
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              <Badge variant="solid" size="sm">
                {selfscheduling.configuration.subject.experienceIds?.length ||
                  0}
              </Badge>
            </p>
          </div>

          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Description
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {selfscheduling.description || "No description provided."}
            </p>
          </div>

          <div>
            <div className="flex items-center mb-2">
              <div className=" text-xs leading-normal text-gray-500 dark:text-gray-400 mr-5">
                Scheduling Window
              </div>
              <div>
                <Badge
                  variant="light"
                  size="sm"
                  color={selfscheduling.isRunning ? "success" : "warning"}
                >
                  {selfscheduling.isRunning ? "Running" : "Pending"}
                </Badge>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {selfscheduling.configuration.schedulingWindow.start} to{" "}
              {selfscheduling.configuration.schedulingWindow.end}
            </p>
            <p className="text-left mt-2">
              {selfscheduling.isRunning ? (
                <Button
                  variant="outlineRed"
                  className="text-xs py-2!"
                  startIcon={<StopIconCircle className="size-4 text-red-500" />}
                  onClick={() => onAction && onAction("close")}
                >
                  Close
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="text-green-600 text-xs py-2!"
                  startIcon={<PlayIcon className="size-4" />}
                  onClick={() => onAction && onAction("open")}
                >
                  Open
                </Button>
              )}
            </p>
          </div>

          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Guides Count
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              <Badge variant="solid" size="sm">
                {selfscheduling.configuration.audience.guideIds?.length || 0}
              </Badge>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
