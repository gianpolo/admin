import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactJson from "@microlink/react-json-view";
import ComponentCard from "../../../components/common/ComponentCard.jsx";
import SnapshotDetailsTitle from "./SnapshotDetailsTitle";
import SnapshotOverview from "./SnapshotOverview.jsx";
import Tabs from "../../../components/common/Tabs.jsx";
import {
  fetchExperiencesSnapshots,
  fetchForecastsSnapshots,
  fetchAudienceSnapshots,
  fetchAllocationsSnapshots,
  fetchSnapshotMeta,
} from "../../../store/snapshotsSlice.js";

import Spinner from "../../ui/spinner/Spinner.jsx";

export default function SnapshotDetails({ snapshotId, isActive, onActivateSnapshot, onPublishSnapshot }) {
  const dispatch = useDispatch();
  const { details } = useSelector((state) => state.snapshots);
  const snapshot =
    details && details[snapshotId]
      ? details[snapshotId]
      : {
          summary: { data: {} },
          experiences: { data: {} },
          forecasts: { data: {} },
          audience: { data: {} },
          allocations: { data: {} },
        };
  const { summary, experiences, forecasts, audience, allocations } = snapshot;
  const [tabs, setTabs] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  useEffect(() => {
    setActiveTab(0);
    dispatch(fetchSnapshotMeta(snapshotId));
    dispatch(fetchExperiencesSnapshots(snapshotId));
  }, [snapshotId, dispatch]);

  useEffect(() => {
    const tabs = [
      {
        label: "Experiences",
        content: <ReactJson src={experiences.data || {}} name={null} collapsed={2} />,
        onTabActive: () => {
          dispatch(fetchExperiencesSnapshots(snapshotId));
        },
      },
      {
        label: "Forecasting",
        content: <ReactJson src={forecasts.data || {}} name={null} collapsed={2} />,
        onTabActive: () => {
          dispatch(fetchForecastsSnapshots(snapshotId));
        },
      },
      {
        label: "Audience",
        content: <ReactJson src={audience.data || {}} name={null} collapsed={2} />,
        onTabActive: () => {
          dispatch(fetchAudienceSnapshots(snapshotId));
        },
      },
      {
        label: "Allocations",
        content: (
          <div>
            {allocations.status === "loading" ? (
              <Spinner />
            ) : (
              <ReactJson src={allocations.data || {}} name={null} collapsed={2} />
            )}
          </div>
        ),
        onTabActive: () => {
          dispatch(fetchAllocationsSnapshots(snapshotId));
        },
      },
    ];
    setTabs(tabs);
  }, [snapshotId, snapshot, dispatch]);

  return (
    <>
      <ComponentCard
        title={
          <SnapshotDetailsTitle
            snapshotDate={summary.data.snapshotDate}
            isActive={isActive}
            createdAt={summary.data.createdAt}
            canGenerateSlots={true}
            onActivateSnapshot={onActivateSnapshot}
            onPublishSnapshot={onPublishSnapshot}
          />
        }
      >
        <SnapshotOverview isActive={isActive} summary={summary.data}></SnapshotOverview>
        {tabs && <Tabs tabsData={tabs} className="mt-4" activeTab={activeTab}></Tabs>}
      </ComponentCard>
    </>
  );
}
