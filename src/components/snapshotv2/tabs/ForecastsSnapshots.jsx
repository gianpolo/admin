import { useSelector } from "react-redux";
import ReactJson from "@microlink/react-json-view";

export default function ForecastsSnapshots({ snapshotId }) {
  const { details } = useSelector((state) => state.snapshots);
  const forecasts = details[snapshotId] ? details[snapshotId].forecasts : null;
  const data = forecasts ? forecasts.data : null;
  return <ReactJson src={data || {}} name={null} collapsed={2} />;
}
