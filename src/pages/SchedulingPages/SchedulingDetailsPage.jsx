import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import PageMeta from "../../components/common/PageMeta.jsx";
import { ChevronLeftIcon } from "../../icons/index.js";
import { startSimulation, stopSimulation } from "../../store/schedulingPlansSlice.js";
import { fetchSchedulingPlanDetails, performSelfschedulingAction } from "../../store/planDetailsSlice.js";
import SchedulingSessionOverview from "../../components/scheduling/SchedulingSessionOverview.jsx";
import Spinner from "../../components/ui/spinner/Spinner.jsx";
import SimulationWidget from "../../components/scheduling/SimulationWidget.jsx";
import SnapshotContainer from "../../components/snapshotv2/SnapshotContainer.jsx";

export default function SchedulingDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isSimulationRunning } = useSelector((state) => state.schedulingPlans);
  const planDetails = useSelector((state) => state.planDetails);
  const { status: detailStatus, error, schedulingPlan } = planDetails;
  const [actionLoading, setActionLoading] = useState(false);

  const snapshots = useSelector((state) => state.snapshots);
  useEffect(() => {
    dispatch(fetchSchedulingPlanDetails(id));
  }, [dispatch, id]);

  const handleAction = async (action) => {
    setActionLoading(true);
    const result = await dispatch(performSelfschedulingAction({ id, action }));
    if (performSelfschedulingAction.fulfilled.match(result)) {
      dispatch(fetchSchedulingPlanDetails(id));
    }
    setActionLoading(false);
  };

  const handleSimulation = () => {
    if (!schedulingPlan) return;
    if (isSimulationRunning) {
      dispatch(stopSimulation({ id }));
    } else {
      dispatch(startSimulation({ id }));
    }
  };

  return (
    <>
      <PageMeta title="SelfScheduling Details" description="Scheduling information" />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={(event) => {
              event.stopPropagation();
              navigate("/scheduling-plans");
            }}
            className="text-gray-400 text-2xl flex mr-10 hover:text-gray-800"
          >
            <ChevronLeftIcon className="inline-block" />
          </button>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Scheduling Plan</h2>
        </div>
        <nav>
          <ol className="flex items-center gap-1.5">
            <li>
              <Link className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400" to="/">
                Home
                <svg
                  className="stroke-current"
                  width="17"
                  height="16"
                  viewBox="0 0 17 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </li>
            <li className="text-sm text-gray-800 dark:text-white/90">Scheduling Details</li>
          </ol>
        </nav>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {status === "loading" ? (
        <Spinner />
      ) : (
        status === "succeeded" && (
          <div className="grid grid-cols-12 gap-6 mt-6">
            <div className="col-span-8">
              <SchedulingSessionOverview
                schedulingPlan={schedulingPlan}
                onAction={handleAction}
                actionLoading={actionLoading}
              />
            </div>
            <div className="col-span-4">
              <SimulationWidget
                isSimulationRunning={isSimulationRunning}
                handleSimulation={handleSimulation}
                disabled={!schedulingPlan.isRunning}
              />
            </div>
          </div>
        )
      )}

      <div className="grid grid-cols-12 gap-6 mt-6">
        <div className="col-span-12">
          <div className="">
            {detailStatus === "succeeded" && snapshots && (
              <SnapshotContainer
                activeSnapshotId={schedulingPlan.activeSnapshotId}
                snapshotList={schedulingPlan.snapshots}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
