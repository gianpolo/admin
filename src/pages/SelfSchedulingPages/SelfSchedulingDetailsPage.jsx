import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import PageMeta from "../../components/common/PageMeta.jsx";
import NotificationsWidget from "../../components/notifications/NotificationsWidget.jsx";
import { ChevronLeftIcon } from "../../icons/index.js";
import { fetchEventsLogs } from "../../store/notificationsSlice.js";
import { startSimulation, stopSimulation, checkSimulation } from "../../store/selfschedulingsSlice.js";
import {
  fetchSelfSchedulingDetails,
  fetchTourItems,
  performConfigurationAction,
  clearLastUpdatedId,
  generateSlots,
} from "../../store/selfschedulingDetailsSlice.js";
import SelfSchedulingInfoCard from "../../components/selfscheduling/SelfSchedulingInfoCard.jsx";
import TourItemList from "../../components/selfscheduling/TourItemList.jsx";
import Spinner from "../../components/ui/spinner/Spinner.jsx";
import SimulationWidget from "../../components/selfscheduling/SimulationWidget.jsx";
import SnapshotsContainer from "../../components/snapshot/SnapshotsContainer.jsx";
export default function SelfSchedulingDetailsPage() {
  const { id } = useParams();
  //const goBack = useGoBack();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isSimulationRunning } = useSelector((state) => state.selfschedulings);
  const { selfscheduling, items, status, itemsStatus, slotsStatus, error, itemsError, lastUpdatedId } = useSelector(
    (state) => state.selfschedulingsDetails
  );

  const [actionLoading, setActionLoading] = useState(false);
  const [highlightId, setHighlightId] = useState(null);
  const [history, setHistory] = useState([]);
  const { snapshotStatus, snapshots } = useSelector((state) => state.selfschedulingsDetails);
  const notifications = useSelector((state) => state.notifications.items);
  const logs = useSelector((state) => state.notifications.logs);
  useEffect(() => {
    dispatch(fetchSelfSchedulingDetails(id));
    //dispatch(fetchTourItems(id));
    //dispatch(checkSimulation({ id }));
    dispatch(fetchEventsLogs(id));
  }, [dispatch, id]);
  useEffect(() => {
    const initialLogs = [...logs];
    setHistory(initialLogs);
  }, [logs]);

  useEffect(() => {
    if (lastUpdatedId) {
      setHighlightId(lastUpdatedId);
      const t = setTimeout(() => {
        setHighlightId(null);
        dispatch(clearLastUpdatedId());
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [lastUpdatedId, dispatch]);

  const handleAction = async (action) => {
    setActionLoading(true);
    const result = await dispatch(performConfigurationAction({ id, action }));
    if (performConfigurationAction.fulfilled.match(result)) {
      dispatch(fetchSelfSchedulingDetails(id));
      dispatch(fetchTourItems(id));
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
        selfscheduling && (
          <div className="grid grid-cols-12 gap-6 mt-6">
            <div className="col-span-8">
              <SelfSchedulingInfoCard
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
        <div className="col-span-12 ">
          <NotificationsWidget notifications={notifications} logs={logs} history={history} />
        </div>
        <div className="col-span-12">
          <div className="">
            {selfscheduling && snapshots && (
              <SnapshotsContainer
                activeSnapshotId={selfscheduling.activeSnapshotId}
                snapshotStatus={snapshotStatus}
                snapshots={snapshots}
                selfSchedulingId={id}
              />
            )}
          </div>
          {/* <TourItemList
            onItemSelection={handleItemClick}
            items={items}
            itemsStatus={itemsStatus}
            itemsError={itemsError}
            highlightId={highlightId}
            generateSlots={handleGenerateSlots}
            slotsStatus={slotsStatus}
          ></TourItemList> */}
        </div>
      </div>
    </>
  );
}
