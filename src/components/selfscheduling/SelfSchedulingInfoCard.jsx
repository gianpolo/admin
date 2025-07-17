import Badge from "../ui/badge/Badge.jsx";
import DateTime from "../common/DateTime";
import Spinner from "../ui/spinner/Spinner.jsx";
import CopyableText from "../common/CopyableText.jsx";
import DateRange from "../common/DateRange.jsx";

export default function SelfSchedulingInfoCard({ selfscheduling, onAction, actionLoading = false }) {
  const { configuration: config, selfSchedulingId:id } = selfscheduling || {};
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
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">SelfScheduling ID</p>
              <div className="text-xs font-medium text-gray-800 dark:text-white/90">
                <p>{id}</p>
              </div>
            </div>
          </CopyableText>
          <CopyableText text={configId}>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Configuration ID</p>
              <div className="text-xs font-medium text-gray-800 dark:text-white/90">
                <p>{configId}</p>
              </div>
            </div>{" "}
          </CopyableText>

          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Tours Period</p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              <DateRange from={toursPeriod.start} to={toursPeriod.end} includeDaysCount />
            </p>
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
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Experiences Count</p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              <Badge variant="solid" size="sm">
                {config.subject.experienceIds?.length || 0}
              </Badge>
            </p>
          </div>
          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Guides Count</p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              <Badge variant="solid" size="sm">
                {config.audience.guideIds?.length || 0}
              </Badge>
            </p>
          </div>
          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Description</p>
            <p className="text-sm font-normal text-gray-800 dark:text-white/90">
              {selfscheduling.description || "No description provided."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
