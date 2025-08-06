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
} from "../../store/snapshotsSlice.js";
import Spinner from "../ui/spinner/Spinner.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
export default function SnapshotDetails({
  snapshotDetail,
  takenAt,
  isActive,
  onActivateSnapshot,
  onPublishSnapshot,
  onChangeTab,
}) {
  if (!snapshotDetail) return <Spinner />;

  const { summary, experiences, forecasts, audience, allocations } = snapshotDetail;
  const [activeTab, setActiveTab] = useState(0);
  const themeContext = useTheme();
  const darkColor =
    themeContext.theme === "dark"
      ? {
          ...monokaiTheme,
          "--w-rjv-background-color": "transparent",
        }
      : {};

  const isActiveClass = isActive ? "border-green-500!" : "border border-grey";
  const tabs = [
    {
      label: "Experiences",
      content: (
        <>
          {experiences && <JsonView className="py-10" value={experiences.data || {}} collapsed={2} style={darkColor} />}
        </>
      ),
      onTabActive: () => onChangeTab(fetchExperiencesSnapshots),
    },
    {
      label: "Forecasting",
      content: (
        <>
          {forecasts && (
            <JsonView
              className="py-10"
              style={themeContext.theme === "dark" && darkColor}
              value={forecasts.data || {}}
              collapsed={2}
            />
          )}
        </>
      ),
      onTabActive: () => onChangeTab(fetchForecastsSnapshots),
    },
    {
      label: "Audience",
      content: (
        <>
          {audience && (
            <JsonView
              className="py-10"
              style={themeContext.theme === "dark" && darkColor}
              value={audience.data || {}}
              collapsed={2}
            />
          )}
        </>
      ),
      onTabActive: () => onChangeTab(fetchAudienceSnapshots),
    },
    {
      label: "Allocations",
      content: (
        <>
          {allocations && (
            <JsonView
              className="py-10"
              style={themeContext.theme === "dark" && darkColor}
              value={allocations.data || {}}
              collapsed={2}
            />
          )}
        </>
      ),
      onTabActive: () => onChangeTab(fetchAllocationsSnapshots),
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
          onPublishSnapshot={onPublishSnapshot}
        />
      }
    >
      <Tabs tabsData={tabs} className="mt-4" activeTab={activeTab}></Tabs>
    </ComponentCard>
  );
}
