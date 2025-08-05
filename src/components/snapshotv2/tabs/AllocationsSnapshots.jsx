import { useSelector } from "react-redux";
import ReactJson from "@microlink/react-json-view";
import Spinner from "../../ui/spinner/Spinner.jsx";

export default function AllocationsSnapshots({ snapshotId }) {
  const { details } = useSelector((state) => state.snapshots);
  const allocations = details[snapshotId] ? details[snapshotId].allocations : null;
  const { status, data } = allocations || {};
  if (status === "loading") return <Spinner />;
  return <ReactJson src={data || {}} name={null} collapsed={2} />;
}
