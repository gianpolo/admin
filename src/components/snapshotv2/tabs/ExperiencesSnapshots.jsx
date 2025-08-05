import { useSelector } from "react-redux";
import ReactJson from "@microlink/react-json-view";

export default function ExperiencesSnapshots({ snapshotId }) {
  const { details } = useSelector((state) => state.snapshots);
  const experiences = details[snapshotId] ? details[snapshotId].experiences : null;
  const data = experiences ? experiences.data : null;
  return <ReactJson src={data || {}} name={null} collapsed={2} />;
}
