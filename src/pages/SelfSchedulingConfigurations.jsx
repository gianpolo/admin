import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import {
  fetchConfigurations,
  openConfiguration,
  closeConfiguration,
} from "../store/configurationsSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { PlayIcon, StopIcon } from "../icons";

const formatPeriod = (start, end) =>
  `${start?.replace(/-/g, "/"}) to ${end?.replace(/-/g, "/")}`;

export default function SelfSchedulingConfigurations() {
  const dispatch = useDispatch();
  const { list, status, error, actionStatus } = useSelector(
    (state) => state.configurations
  );

  useEffect(() => {
    dispatch(fetchConfigurations({ pageSize: 10, pageNumber: 1, cityId: 1 }));
  }, [dispatch]);

  return (
    <>
      <PageMeta title="Self Scheduling Configurations" description="List of Self Scheduling Configurations" />
      <PageBreadcrumb pageTitle="Self Scheduling Configurations" />
      <div className="mb-4">
        <a href="/self-scheduling-configurations/new" className="inline-flex items-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600">Add New</a>
      </div>
      {status === "loading" && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  City
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  ID / Description
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Tours Period
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Scheduling Window
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Experiences
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Guides
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {list.map((cfg) => {
                const loading = actionStatus[cfg.id] === "loading";
                return (
                  <TableRow
                    key={cfg.id}
                    className={`${cfg.isRunning ? "border-l-4 border-green-500" : "bg-gray-50"}`}
                  >
                    <TableCell className="px-5 py-4 text-start">{cfg.cityId}</TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <div className="leading-snug">
                        <div className="text-sm font-normal text-gray-500">{cfg.id}</div>
                        <div className="text-brand-600 truncate">{cfg.description}</div>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      {formatPeriod(cfg.toursPeriodStart, cfg.toursPeriodEnd)}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      {formatPeriod(cfg.schedulingWindowStart, cfg.schedulingWindowEnd)}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      {cfg.experienceIds && cfg.experienceIds.join(", ")}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      {cfg.guideIds && cfg.guideIds.join(", ")}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      {loading ? (
                        <svg
                          className="inline-block h-4 w-4 animate-spin text-gray-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          ></path>
                        </svg>
                      ) : cfg.isRunning ? (
                        <button
                          onClick={() =>
                            dispatch(closeConfiguration({ id: cfg.id }))
                          }
                          className="text-red-600"
                        >
                          <StopIcon className="inline-block" />
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            dispatch(openConfiguration({ id: cfg.id }))
                          }
                          className="text-green-600"
                        >
                          <PlayIcon className="inline-block" />
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
