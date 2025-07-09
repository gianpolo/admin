import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSnapshotDetails } from "../../store/selfschedulingDetailsSlice.js";
import SnapshotOverview from "./SnapshotOverview.jsx";
import Spinner from "../ui/spinner/Spinner.jsx";

import ComponentCard from "../common/ComponentCard.jsx";
import SnapshotItemsTable from "./SnapshotItemsTable.jsx";
import SnapshotDetailsTitle from "./SnapshotDetailsTitle";
export default function SnapshotDetails({ snapshotId, isActive, loading, onActivateSnapshot, onGenerateSlots }) {
  const dispatch = useDispatch();
  const [snapshotDate, setSnapshotDate] = useState();
  const { snapshotsDetails } = useSelector((state) => state.selfschedulingsDetails);
  useEffect(() => {
    dispatch(fetchSnapshotDetails(snapshotId));
  }, [snapshotId]);
  useEffect(() => {
    if (snapshotsDetails && snapshotsDetails[snapshotId] && snapshotsDetails[snapshotId].loaded) {
      setSnapshotDate(snapshotsDetails[snapshotId].data.snapshotSummary.snapshotDate);
    }
  }, [snapshotsDetails, snapshotId]);

  if (
    loading ||
    !snapshotsDetails[snapshotId] ||
    snapshotsDetails[snapshotId].loading ||
    !snapshotsDetails[snapshotId].data
  ) {
    return <Spinner fullscreen />;
  } else {
    return (
      <>
        <ComponentCard
          title={
            <SnapshotDetailsTitle
              snapshotDate={snapshotDate}
              isActive={isActive}
              canGenerateSlots={true}
              onActivateSnapshot={onActivateSnapshot}
              onGenerateSlots={onGenerateSlots}
            />
          }
        >
          <SnapshotOverview
            isActive={isActive} 
            snapshotSummary={snapshotsDetails[snapshotId].data.snapshotSummary}
          ></SnapshotOverview>
          <SnapshotItemsTable snapshotItems={snapshotsDetails[snapshotId].data.items} />
        </ComponentCard>
      </>
    );
  }
}
