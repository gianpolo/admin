import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSnapshotDetails } from "../../store/snapshotsSlice.js";
import SnapshotOverview from "./SnapshotOverview.jsx";
import Spinner from "../ui/spinner/Spinner.jsx";
import ComponentCard from "../common/ComponentCard";
import TourSnapshots from "./TourSnapshots";
import SnapshotDetailsTitle from "./SnapshotDetailsTitle";
export default function SnapshotDetails({ snapshotId, isActive, loading, onActivateSnapshot, onGenerateSlots }) {
  const dispatch = useDispatch();
  const { details, status } = useSelector((state) => state.snapshots);
  const { snapshotSummary, tours } = details;
  const { snapshotDate } = snapshotSummary;
  useEffect(() => {
    dispatch(fetchSnapshotDetails(snapshotId));
  }, [snapshotId]);
  if (loading && status === "loading") {
    return <Spinner fullscreen />;
  } else {
    return (
      <>
        <ComponentCard
          title={
            <SnapshotDetailsTitle
              snapshotDate={snapshotDate}
              isActive={isActive}
              createdAt={snapshotSummary.createdAt}
              canGenerateSlots={true}
              onActivateSnapshot={onActivateSnapshot}
              onGenerateSlots={onGenerateSlots}
            />
          }
        >
          <SnapshotOverview isActive={isActive} snapshotSummary={snapshotSummary}></SnapshotOverview>
          <TourSnapshots tours={tours} />
        </ComponentCard>
      </>
    );
  }
}
