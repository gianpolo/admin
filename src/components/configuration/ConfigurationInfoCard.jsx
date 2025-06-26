import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Badge from "../ui/badge/Badge.jsx";
import { PlayIcon, StopIconCircle } from "../../icons";
import Spinner from "../ui/spinner/Spinner";

export default function ConfigurationInfoCard({
  config,
  onAction,
  onSimulation,
  isSimulating = false,
  actionLoading = false,
}) {
  const { isOpen, openModal, closeModal } = useModal();
  const handleSave = () => {
    console.log("Saving changes...");
    closeModal();
  };
  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Overview
            </h4>
            <Badge
              variant="light"
              color={config.isRunning ? "success" : "warning"}
            >
              {config.isRunning ? "Running" : "Pending"}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            {actionLoading ? (
              <Spinner />
            ) : config.isRunning ? (
              <Button
                variant="outlineRed"
                className="text-xs py-2!"
                startIcon={<StopIconCircle className="size-4 text-red-500" />}
                onClick={() => onAction && onAction("close")}
              >
                Close
              </Button>
            ) : (
              <Button
                variant="outline"
                className="text-green-600 text-xs py-2!"
                startIcon={<PlayIcon className="size-4" />}
                onClick={() => onAction && onAction("open")}
              >
                Open
              </Button>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex">
            {config.isRunning && onSimulation && (
              <Button variant="outline" onClick={onSimulation}>
                {isSimulating
                  ? "Stop Virtual SelfScheduling"
                  : "Start Virtual SelfScheduling"}
              </Button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7 2xl:gap-x-32">
          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Id
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {config.id}
            </p>
          </div>
          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Tours Period
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {config.toursPeriodStart} - {config.toursPeriodEnd}
            </p>
          </div>

          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Experiences Count
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {config.experienceIds?.length || 0}
            </p>
          </div>

          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Description
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {config.description || "No description provided."}
            </p>
          </div>

          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Scheduling Window
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {config.schedulingWindowStart} - {config.schedulingWindowEnd}
            </p>
          </div>

          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Guides Count
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {config.guideIds?.length || 0}
            </p>
          </div>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Personal Information
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your details to keep your profile up-to-date.
            </p>
          </div>
          <form className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div>
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Social Links
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Label>Facebook</Label>
                    <Input
                      type="text"
                      value="https://www.facebook.com/PimjoHQ"
                    />
                  </div>

                  <div>
                    <Label>X.com</Label>
                    <Input type="text" value="https://x.com/PimjoHQ" />
                  </div>

                  <div>
                    <Label>Linkedin</Label>
                    <Input
                      type="text"
                      value="https://www.linkedin.com/company/pimjo"
                    />
                  </div>

                  <div>
                    <Label>Instagram</Label>
                    <Input type="text" value="https://instagram.com/PimjoHQ" />
                  </div>
                </div>
              </div>
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Personal Information
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>First Name</Label>
                    <Input type="text" value=" Gianpiero" />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Last Name</Label>
                    <Input type="text" value="Ferraro" />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Email Address</Label>
                    <Input type="text" value="randomuser@pimjo.com" />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Phone</Label>
                    <Input type="text" value="+09 363 398 46" />
                  </div>

                  <div className="col-span-2">
                    <Label>Bio</Label>
                    <Input type="text" value="Developer" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
