import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
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
import { PlayIcon, StopIconCircle } from "../icons";


export default function SelfSchedulingConfigurations() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formatPeriod = (start, end) =>
    `${(start || '').replace(/-/g, '/')} to ${(end || '').replace(/-/g, '/')}`;


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
                  className="px-6 py-3 whitespace-nowrap"
                ><div class="flex items-center">
                    <p className="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Description / ID</p> </div>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-6 py-3 whitespace-nowrap"
                > <div class="flex items-center">
                    <p className="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Scheduling Window</p>
                  </div>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-6 py-3 whitespace-nowrap"
                >
                  <div class="flex items-center">
                    <p className="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Tours Period</p>
                  </div>

                </TableCell>
                <TableCell
                  isHeader
                  className="px-6 py-3 whitespace-nowrap"
                > <div class="flex items-center">
                    <p className="font-medium text-gray-500 text-theme-xs dark:text-gray-400">City ID</p> </div>

                </TableCell>
                <TableCell
                  isHeader
                  className="px-6 py-3 whitespace-nowrap"
                > <div class="flex items-center">
                    <p className="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Experiences Count</p>
                  </div>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-6 py-3 whitespace-nowrap"
                > <div class="flex items-center">
                    <p className="font-medium text-gray-500 text-theme-xs dark:text-gray-400"> Guides Count</p>
                  </div>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-6 py-3 whitespace-nowrap"
                ><div class="flex items-center">
                    <p className="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Actions</p> </div>

                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {list.map((cfg) => {
                const loading = actionStatus[cfg.id] === "loading";
                return (
                  <TableRow
                    key={cfg.id}
                    className={`cursor-pointer ${cfg.isRunning ? " dark:bg-brand-500/12" : ""}`}
                    handleClick={() => navigate(`/self-scheduling-configurations/${cfg.id}`)}
                  >
                    <TableCell className="px-6 py-3 whitespace-nowrap">
                      <div className="leading-snug">
                        <div className="dark:text-white font-medium truncate">{cfg.description}</div>
                        <div className={`text-theme-xs   ${cfg.isRunning ? "text-gray-400" : "dark:text-gray-400"}`}>{cfg.id}</div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-3 whitespace-nowrap"><div class="flex items-center">
                      <p className="text-gray-500 text-theme-sm dark:text-gray-400" >{formatPeriod(cfg.schedulingWindowStart, cfg.schedulingWindowEnd)}</p>
                    </div></TableCell>
                    <TableCell className="px-6 py-3 whitespace-nowrap"><div class="flex items-center">
                      <p className="text-gray-500 text-theme-sm dark:text-gray-400" > {formatPeriod(cfg.toursPeriodStart, cfg.toursPeriodEnd)}</p>
                    </div></TableCell>
                    <TableCell className="px-6 py-3 whitespace-nowrap"><div class="flex items-center">
                      <p className="text-gray-500 text-theme-sm dark:text-gray-400">{cfg.cityId}</p>
                    </div></TableCell>
                    <TableCell className="px-6 py-3 whitespace-nowrap"><div class="flex items-center">
                      <p className="text-gray-500 text-theme-sm dark:text-gray-400">{cfg.experienceIds && cfg.experienceIds.length}</p>
                    </div></TableCell>
                    <TableCell className="px-6 py-3 whitespace-nowrap"><div class="flex items-center">
                      <p className="text-gray-500 text-theme-sm dark:text-gray-400">{cfg.guideIds && cfg.guideIds.length}</p>
                    </div></TableCell>
                    <TableCell className="px-6 py-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      {loading ? (
                        <svg
                          className="inline-block h-4 w-4 animate-spin text-gray-500 text-lg"
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

                          onClick={(event) => {
                            event.stopPropagation();
                            dispatch(closeConfiguration({ id: cfg.id }))
                          }
                          }
                          className="text-red-600 text-lg hover:text-2xl"
                        >
                          <StopIconCircle className="inline-block" />
                        </button>
                      ) : (
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            dispatch(openConfiguration({ id: cfg.id }))
                          }
                          }
                          className="text-green-600 text-lg hover:text-2xl"
                        >
                          <PlayIcon className="inline-block" />
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div >
    </>
  );
}
