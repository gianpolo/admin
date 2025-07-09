import { useState } from "react";
import InputField from "../form/input/InputField.jsx";
import Form from "../form/Form.jsx";
import Button from "../ui/button/Button.jsx";
import { PlusIcon } from "../../icons/index.js";
import Spinner from "../ui/spinner/Spinner.jsx";
export default function EmptySnapshot({ loading, onAddSnapshot }) {
  const [snapshotLabel, setSnapshotLabel] = useState(
    "Generated from Dashboard"
  );
  return (
    <div className="mx-auto w-full max-w-[560px] text-center">
      <div className="flex flex-col h-full justify-between border border-gray-200 dark:border-gray-800 max-h-full rounded-2xl bg-white p-6 text-center dark:bg-white/[0.03]">
        <div className="mx-auto flex mb-6">
          <h3 className="mb-3 font-bold text-gray-800 text-title-md dark:text-white/90 xl:text-title-l">
            No Snapshot Taken Yet
          </h3>
        </div>
        <div className="flex  ">
          <p className="text-base text-gray-500 mb-9 text-center dark:text-gray-400 w-full h-full">
            Capture the current forecasting and tours data for this SelfScheduling by taking a
            snapshot now.
          </p>
        </div>
        <Form onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            <div className="w-full sm:w-[320px]">
              <InputField
                name="snapshotLabel"
                placeholder="Snapshot Label"
                value={snapshotLabel}
                onChange={(e) => setSnapshotLabel(e.target.value)}
                className="w-full px-4 py-3 text-sm text-gray-800 bg-transparent border border-gray-300 rounded-lg h-11 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:shadow-focus-ring focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-gray-400 dark:focus:border-brand-300"
              />
            </div>
            {onAddSnapshot && (
              <Button
                size="custom"
                className="flex sm:w-[190px] items-center justify-center px-4 py-3 text-sm font-medium"
                onClick={() => onAddSnapshot(snapshotLabel)}
                disabled={loading}
                startIcon={loading ? <Spinner size="xs" /> : <PlusIcon />}
              >
                Take a snapshot now
              </Button>
            )}
          </div>
        </Form>
      </div>
    </div>
  );
}
