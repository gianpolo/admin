import { useSelector } from "react-redux";
import ReactJson from "@microlink/react-json-view";

export default function AudienceSnapshots({ snapshotId }) {
  const { details } = useSelector((state) => state.snapshots);
  const audience = details[snapshotId] ? details[snapshotId].audience : null;
  const data = audience ? audience.data : null;
  return <ReactJson src={data || {}} name={null} collapsed={2} />;
}
