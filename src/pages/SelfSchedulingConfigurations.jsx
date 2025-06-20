import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import { fetchConfigurations } from "../store/configurationsSlice";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../components/ui/table";

export default function SelfSchedulingConfigurations() {
  const dispatch = useDispatch();
  const { list, status, error } = useSelector((state) => state.configurations);

  useEffect(() => {
    dispatch(fetchConfigurations({ pageSize: 10, pageNumber: 1, cityId:1 }));
  }, [dispatch]);

  return (
    <>
      <PageMeta title="Self Scheduling Configurations" description="List of Self Scheduling Configurations" />
      <PageBreadcrumb pageTitle="Self Scheduling Configurations" />
      {status === "loading" && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">ID</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">City</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Description</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Tours Start</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Tours End</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Schedule Start</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Schedule End</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Experiences</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Guides</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {list.map((cfg) => (
                <TableRow key={cfg.id}>
                  <TableCell className="px-5 py-4 text-start">{cfg.id}</TableCell>
                  <TableCell className="px-5 py-4 text-start">{cfg.cityId}</TableCell>
                  <TableCell className="px-5 py-4 text-start">{cfg.description}</TableCell>
                  <TableCell className="px-5 py-4 text-start">{cfg.toursPeriodStart}</TableCell>
                  <TableCell className="px-5 py-4 text-start">{cfg.toursPeriodEnd}</TableCell>
                  <TableCell className="px-5 py-4 text-start">{cfg.schedulingWindowStart}</TableCell>
                  <TableCell className="px-5 py-4 text-start">{cfg.schedulingWindowEnd}</TableCell>
                  <TableCell className="px-5 py-4 text-start">{cfg.experienceIds && cfg.experienceIds.join(", ")}</TableCell>
                  <TableCell className="px-5 py-4 text-start">{cfg.guideIds && cfg.guideIds.join(", ")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
