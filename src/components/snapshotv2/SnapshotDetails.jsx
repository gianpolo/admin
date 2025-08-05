import ComponentCard from "../common/ComponentCard.jsx";
import SnapshotDetailsTitle from "../snapshot/selectedSnapshot/SnapshotDetailsTitle.jsx";
import SnapshotOverview from "../snapshot/selectedSnapshot/SnapshotOverview.jsx";

export default function SnapshotDetails({ summary, isActive, onActivateSnapshot, onPublishSnapshot }) {
  if (!summary) return null;
  return (
    <ComponentCard
      title={
        <SnapshotDetailsTitle
          snapshotDate={summary.snapshotDate}
          isActive={isActive}
          onActivateSnapshot={onActivateSnapshot}
          onPublishSnapshot={onPublishSnapshot}
        />
      }
    >
      <SnapshotOverview summary={summary} isActive={isActive} />
    </ComponentCard>
  );
}
