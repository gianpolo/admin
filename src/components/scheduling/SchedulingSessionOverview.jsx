import Badge from "../ui/badge/Badge";
import DateTime from "../common/DateTime";
import Spinner from "../ui/spinner/Spinner";
import CopyableText from "../common/CopyableText";
import DateRange from "../common/DateRange";

export default function SchedulingSessionOverview({ schedulingPlan, onAction, actionLoading = false }) {
  const { schedulingSubject, schedulingWindow, schedulingPlanId, schedulingAudience } = schedulingPlan || {};
  const getDaysLeft = (date) => {
    const today = new Date();
    const target = new Date(date);
    const diffMs = target - today;
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  };
  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">Overview</h4>
          </div>
          <div className="flex flex-wrap gap-2">{actionLoading && <Spinner />}</div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
          <CopyableText text={schedulingPlanId}>
            <div>
              <div className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Session ID</div>
              <div className="text-xs font-medium text-gray-800 dark:text-white/90">
                <div>{schedulingPlanId}</div>
              </div>
            </div>
          </CopyableText>
          <CopyableText text={schedulingPlanId}>
            <div>
              <div className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">ID</div>
              <div className="text-xs font-medium text-gray-800 dark:text-white/90">
                <div>{schedulingPlanId}</div>
              </div>
            </div>
          </CopyableText>

          <div>
            <div className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Tours Period</div>
            <div className="text-sm font-medium text-gray-800 dark:text-white/90">
              <DateRange
                from={schedulingSubject.toursPeriod.start}
                to={schedulingSubject.toursPeriod.end}
                includeDaysCount
              />
            </div>
          </div>
          <div>
            <div className="flex items-center mb-2">
              <div className=" text-xs leading-normal text-gray-500 dark:text-gray-400 mr-5">Scheduling Window</div>
              <div>
                <Badge variant="light" size="sm" color={schedulingPlan.isRunning ? "success" : "info"}>
                  {schedulingPlan.isRunning ? "Running" : getDaysLeft(schedulingWindow.start) + " days left"}
                </Badge>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              <DateTime date={schedulingWindow.start} />
              &nbsp;to&nbsp;
              <DateTime date={schedulingWindow.end} />
            </p>
          </div>
          <div className="grid grid-cols-3 col-span-2">
            <div>
              <div className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Experiences Count</div>
              <div className="text-sm font-medium text-gray-800 dark:text-white/90">
                <Badge variant="solid" size="sm">
                  {schedulingSubject.experienceIds?.length || 0}
                </Badge>
              </div>
            </div>
            <div>
              <div className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Guides Count</div>
              <div className="text-sm font-medium text-gray-800 dark:text-white/90">
                <Badge variant="solid" size="sm">
                  {schedulingAudience.guideIds?.length || 0}
                </Badge>
              </div>
            </div>
            <div>
              <div className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Snapshots Count</div>
              <div className="text-sm font-medium text-gray-800 dark:text-white/90">
                <Badge variant="solid" size="sm">
                  {schedulingPlan.snapshots?.length}
                </Badge>
              </div>
            </div>
          </div>
          <div>
            <div className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Description</div>
            <div className="text-sm font-normal text-gray-800 dark:text-white/90">
              {schedulingPlan.description || "No description provided."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
