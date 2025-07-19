import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import PageMeta from "../../components/common/PageMeta";
import { ChevronLeftIcon } from "../../icons/index.js";
import { startSimulation, stopSimulation } from "../../store/selfschedulingsSlice.js";
import { fetchSelfschedulingDetails, performSelfschedulingAction } from "../../store/selfschedulingDetailsSlice.js";
import SelfSchedulingOverview from "../../components/selfscheduling/SelfSchedulingOverview";
import Spinner from "../../components/ui/spinner/Spinner";
import SimulationWidget from "../../components/selfscheduling/SimulationWidget";
import SnapshotsContainer from "../../components/snapshot/SnapshotsContainer";

export default function SelfSchedulingDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isSimulationRunning } = useSelector((state) => state.selfschedulings);
  const selfscheduling = useSelector((state) => state.selfschedulingDetails);
  const { status, error } = selfscheduling;
  const [actionLoading, setActionLoading] = useState(false);

  const snapshots = useSelector((state) => state.snapshots);
  useEffect(() => {
    dispatch(fetchSelfschedulingDetails(id));
  }, [dispatch, id]);

  const handleAction = async (action) => {
    setActionLoading(true);
    const result = await dispatch(performConfigurationAction({ id, action }));
    if (performSelfschedulingAction.fulfilled.match(result)) {
      dispatch(fetchSelfscheduling(id));
    }
    setActionLoading(false);
  };

  const handleSimulation = () => {
    if (!selfscheduling) return;
    if (isSimulationRunning) {
      dispatch(stopSimulation({ id }));
    } else {
      dispatch(startSimulation({ id }));
    }
  };

  const handleItemClick = (id) => {
    navigate(`/self-scheduling-items/${id}`);
  };
  return (
    <>
      <PageMeta title="SelfScheduling Details" description="SelfScheduling information" />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={(event) => {
              event.stopPropagation();
              navigate("/self-schedulings");
            }}
            className="text-gray-400 text-2xl flex mr-10 hover:text-gray-800"
          >
            <ChevronLeftIcon className="inline-block" />
          </button>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">SelfScheduling Details</h2>
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
            <li className="text-sm text-gray-800 dark:text-white/90">Configuration Details</li>
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
              <SelfSchedulingOverview
                selfscheduling={selfscheduling}
                onAction={handleAction}
                actionLoading={actionLoading}
              />
            </div>
            <div className="col-span-4">
              <SimulationWidget
                isSimulationRunning={isSimulationRunning}
                handleSimulation={handleSimulation}
                disabled={!selfscheduling.isRunning}
              />
            </div>
          </div>
        )
      )}

      <div className="grid grid-cols-12 gap-6 mt-6">
        {/* <div className="mt-6 col-span-12">
          <Timeline />
        </div> */}
        {/* <div className="col-span-5 "> 
          <Timeline />
        </div>
        <div className="col-span-5 ">
           <NotificationsWidget notifications={notifications} logs={logs} history={history} />  
        </div> */}
        <div className="col-span-12">
          <div className="">
            {status === "succeeded" && snapshots && (
              <SnapshotsContainer
                activeSnapshotId={selfscheduling.activeSnapshotId}
                snapshotStatus={status === "succeeded"}
                snapshots={snapshots}
                selfSchedulingId={selfscheduling.selfSchedulingId}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
