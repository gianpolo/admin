import InputField from "../form/input/InputField.jsx";
import Label from "../form/Label.jsx";
import Button from "../ui/button/Button.jsx";
import { PlusIcon } from "../../icons/index.js";
export default function SnapshotListAddOn({ snapshotLabel, setSnapshotLabel, onAddSnapshot, canAddSnapshot }) {
  return (
    <>
      <div className="border-b dark:border-gray-800">
        <div>
          <Label htmlFor="desc" className="  text-xs leading-normal text-gray-500 dark:text-gray-400">
            Snapshot Label
          </Label>
          <InputField
            disabled={false}
            id="desc"
            className="text-xs  h-9!"
            value={snapshotLabel}
            onChange={(e) => setSnapshotLabel(e.target.value)}
          />
        </div>
        <Button
          size="sm"
          className="w-full mt-4"
          onClick={() => onAddSnapshot(snapshotLabel)}
          disabled={!canAddSnapshot || false}
          startIcon={false ? <Spinner size="xs" /> : <PlusIcon />}
        >
          Take a snapshot now
        </Button>
      </div>
    </>
  );
}
