import { useState } from "react";
import ComponentCard from "../common/ComponentCard.jsx";
import SnapshotDetailsTitle from "./SnapshotDetailsTitle.jsx";
import JsonView from "@uiw/react-json-view";
import Tabs from "../common/Tabs.jsx";
import { monokaiTheme } from "@uiw/react-json-view/monokai";
import {
  fetchExperiencesSnapshots,
  fetchForecastsSnapshots,
  fetchAudienceSnapshots,
  fetchAllocationsSnapshots,
  fetchRunningDatesSnapshots,
  fetchCompatibilityRulesSnapshots,
} from "../../store/snapshotsSlice.js";
import Spinner from "../ui/spinner/Spinner.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
export default function SnapshotDetails({
  snapshotDetail,
  takenAt,
  isActive,
  onActivateSnapshot,
  onChangeTab,
  canActivate,
}) {
  if (!snapshotDetail) return <Spinner />;

  const { summary, experiences, forecasts, audience, allocations, runningdates, compatibilityrules } = snapshotDetail;
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const themeContext = useTheme();
  const darkColor =
    themeContext.theme === "dark"
      ? {
          ...monokaiTheme,
          "--w-rjv-background-color": "transparent",
        }
      : {};
  const onChangeTabLocal = (tabIndex, action) => {
    onChangeTab(action);
    setActiveTabIndex(tabIndex);
  };
  const isActiveClass = isActive ? "border-green-500!" : "border border-grey";
  const tabs = [
    {
      label: "Experiences",
      content: (
        <>
          {experiences && (
            <JsonView
              className="py-10 max-h-150 custom-scrollbar overflow-y-auto min-h-150"
              value={experiences.data || {}}
              collapsed={2}
              style={darkColor}
              displayDataTypes={false}
            />
          )}
        </>
      ),
      onTabActive: () => onChangeTabLocal(0, fetchExperiencesSnapshots),
    },
    {
      label: "Running Dates",
      content: (
        <>
          {runningdates && (
            <JsonView
              className="py-10 max-h-150 custom-scrollbar overflow-y-auto min-h-150"
              value={runningdates.data || {}}
              collapsed={2}
              style={darkColor}
              displayDataTypes={false}
            />
          )}
        </>
      ),
      onTabActive: () => onChangeTabLocal(1, fetchRunningDatesSnapshots),
    },
    {
      label: "Forecasting",
      content: (
        <>
          {forecasts && (
            <JsonView
              className="py-10 max-h-150 custom-scrollbar overflow-y-auto min-h-150"
              style={themeContext.theme === "dark" && darkColor}
              value={forecasts.data || {}}
              collapsed={2}
              displayDataTypes={false}
            />
          )}
        </>
      ),
      onTabActive: () => onChangeTabLocal(2, fetchForecastsSnapshots),
    },
    {
      label: "Audience",
      content: (
        <>
          {audience && (
            <JsonView
              className="py-10 max-h-150 custom-scrollbar overflow-y-auto min-h-150"
              style={themeContext.theme === "dark" && darkColor}
              value={audience.data || {}}
              collapsed={2}
              displayDataTypes={false}
            />
          )}
        </>
      ),
      onTabActive: () => onChangeTabLocal(3, fetchAudienceSnapshots),
    },
    {
      label: "Allocations",
      content: (
        <>
          {allocations && (
            <JsonView
              className="py-10 max-h-150 custom-scrollbar overflow-y-auto min-h-150"
              style={themeContext.theme === "dark" && darkColor}
              value={allocations.data || {}}
              collapsed={2}
              displayDataTypes={false}
            />
          )}
        </>
      ),
      onTabActive: () => onChangeTabLocal(4, fetchAllocationsSnapshots),
    },
    {
      label: "Compatibility Rules",
      content: (
        <>
          {compatibilityrules && (
            <JsonView
              className="py-10 max-h-150 custom-scrollbar overflow-y-auto min-h-150"
              style={themeContext.theme === "dark" && darkColor}
              value={compatibilityrules.data || {}}
              collapsed={2}
            />
          )}
        </>
      ),
      onTabActive: () => onChangeTabLocal(5, fetchCompatibilityRulesSnapshots),
    },
  ];
  return (
    <ComponentCard
      className={` ${isActiveClass}`}
      title={
        <SnapshotDetailsTitle
          summary={summary}
          takenAt={takenAt}
          isActive={isActive}
          onActivateSnapshot={onActivateSnapshot}
          canActivate={canActivate}
        />
      }
    >
      <Tabs tabsData={tabs} className="mt-4" activeTabIndex={activeTabIndex}></Tabs>
    </ComponentCard>
  );
}
