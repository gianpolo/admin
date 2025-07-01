import Button from "../ui/button/Button";
export default function SimulationWidget({
  isSimulationRunning,
  handleSimulation,
  disabled,
}) {
  return (
    <div className="flex flex-col   h-full justify-between max-h-full rounded-2xl bg-gray-50 p-6 text-center dark:bg-white/[0.03]">
      <div className="mx-auto flex mb-6">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Self Scheduling Simulation
        </h3>
      </div>
      <div className="flex h-full">
        <p className="text-gray-500 text-theme-sm dark:text-gray-400">
          Simulate guides during the SelfScheduling window who randomly add or
          remove items from the basket and confirm or abandon the basket.
        </p>
      </div>

      <div>
        <div className="flex">
          {handleSimulation && (
            <Button
              disabled={disabled}
              className="bg-brand-500 text-theme-sm hover:bg-brand-600 w-full"
              onClick={handleSimulation}
            >
              {isSimulationRunning ? "Stop" : "Start"}
            </Button>
          )}
        </div>
        <div className="mt-6 text-xs italic  dark:text-orange-300 text-left">
          {disabled && (
            <span>Simulation is available only for opened selfscheduling</span>
          )}
        </div>
      </div>
    </div>
  );
}
