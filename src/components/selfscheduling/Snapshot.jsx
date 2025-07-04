import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSnapshotDetails } from "../../store/selfschedulingDetailsSlice.js";
import SnapshotOverview from "./SnapshotOverview";
import Spinner from "../ui/spinner/Spinner.jsx";
import Tabs from "../common/Tabs.jsx";
import ForecastTable from "./ForecastTable.jsx";
export default function Snapshot({
  snapshotId,
  label,
  isActive,
  loading,
  onActivateSnapshot,
}) {
  const [tabsData, setTabsData] = useState();
  const dispatch = useDispatch();
  const { snapshotsDetails } = useSelector(
    (state) => state.selfschedulingsDetails
  );
  useEffect(() => {
    dispatch(fetchSnapshotDetails(snapshotId));
  }, [snapshotId]);

  useEffect(() => {
    if (snapshotsDetails[snapshotId] && snapshotsDetails[snapshotId].loaded) {
      const data = snapshotsDetails[snapshotId].data;
      const tb = [
        {
          label: "Forecast",
          content: <ForecastTable snapshot={data} />,
        },
      ];
      setTabsData(tb);
    }
  }, [snapshotsDetails, snapshotId]);

  if (
    loading ||
    !snapshotsDetails[snapshotId] ||
    snapshotsDetails[snapshotId].loading ||
    !snapshotsDetails[snapshotId].data ||
    !tabsData
  ) {
    return <Spinner fullscreen />;
  } else {
    return (
      <>
        <SnapshotOverview
          isActive={isActive}
          onActivateSnapshot={onActivateSnapshot}
          label={label}
          snapshot={snapshotsDetails[snapshotId].data}
        ></SnapshotOverview>
        <div className="mt-6">
          <Tabs tabsData={tabsData}></Tabs>
        </div>
      </>
    );
  }
}
