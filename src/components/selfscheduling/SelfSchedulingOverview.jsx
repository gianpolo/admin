import Badge from "../ui/badge/Badge";
import DateTime from "../common/DateTime";
import Spinner from "../ui/spinner/Spinner";
import CopyableText from "../common/CopyableText";
import DateRange from "../common/DateRange";

export default function SelfSchedulingOverview({ selfscheduling, onAction, actionLoading = false }) {
  const { configuration: config, selfSchedulingId: id } = selfscheduling || {};
  const { toursPeriod, schedulingWindow, configurationId: configId } = config || {};
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
          <CopyableText text={id}>
            <div>
              <div className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">SelfScheduling ID</div>
              <div className="text-xs font-medium text-gray-800 dark:text-white/90">
                <div>{id}</div>
              </div>
            </div>
          </CopyableText>
          <CopyableText text={configId}>
            <div>
              <div className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Configuration ID</div>
              <div className="text-xs font-medium text-gray-800 dark:text-white/90">
                <div>{configId}</div>
              </div>
            </div>{" "}
          </CopyableText>

          <div>
            <div className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Tours Period</div>
            <div className="text-sm font-medium text-gray-800 dark:text-white/90">
              <DateRange from={toursPeriod.start} to={toursPeriod.end} includeDaysCount />
            </div>
          </div>
          <div>
            <div className="flex items-center mb-2">
              <div className=" text-xs leading-normal text-gray-500 dark:text-gray-400 mr-5">Scheduling Window</div>
              <div>
                <Badge variant="light" size="sm" color={selfscheduling.isRunning ? "success" : "warning"}>
                  {selfscheduling.isRunning ? "Running" : "Pending"}
                </Badge>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              <DateTime date={schedulingWindow.start} />
              &nbsp;to&nbsp;
              <DateTime date={schedulingWindow.end} />
            </p>
          </div>
          <div>
            <div className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Experiences Count</div>
            <div className="text-sm font-medium text-gray-800 dark:text-white/90">
              <Badge variant="solid" size="sm">
                {config.subject.experienceIds?.length || 0}
              </Badge>
            </div>
          </div>
          <div>
            <div className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Guides Count</div>
            <div className="text-sm font-medium text-gray-800 dark:text-white/90">
              <Badge variant="solid" size="sm">
                {config.audience.guideIds?.length || 0}
              </Badge>
            </div>
          </div>
          <div>
            <div className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Description</div>
            <div className="text-sm font-normal text-gray-800 dark:text-white/90">
              {selfscheduling.description || "No description provided."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
