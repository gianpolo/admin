import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import PageMeta from "../../components/common/PageMeta.jsx";
import useGoBack from "../../hooks/useGoBack.js";
import NotificationsWidget from "../../components/notifications/NotificationsWidget";
import { ChevronLeftIcon } from "../../icons";
import {
  startSimulation,
  stopSimulation,
  checkSimulation,
} from "../../store/configurationsSlice.js";
import {
  fetchConfigurationDetails,
  fetchConfigurationItems,
  performConfigurationAction,
  clearLastUpdatedId,
  generateSlots,
} from "../../store/configurationDetailsSlice.js";
import ConfigurationInfoCard from "../../components/configuration/ConfigurationInfoCard.jsx";
import TourItemList from "../../components/configuration/TourItemList.jsx";
import Spinner from "../../components/ui/spinner/Spinner";
import SimulationWidget from "../../components/configuration/SimulationWidget.jsx";
export default function SelfSchedulingConfigurationDetails() {
  const { id } = useParams();
  //const goBack = useGoBack();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { simulationMessage, isSimulationRunning } = useSelector(
    (state) => state.configurations
  );
  const {
    config,
    items,
    status,
    itemsStatus,
    slotsStatus,
    error,
    itemsError,
    lastUpdatedId,
  } = useSelector((state) => state.configDetails);

  const [actionLoading, setActionLoading] = useState(false);
  const [highlightId, setHighlightId] = useState(null);
  useEffect(() => {
    dispatch(fetchConfigurationDetails(id));
    dispatch(fetchConfigurationItems(id));
    dispatch(checkSimulation({ id }));
  }, [dispatch, id]);

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
      dispatch(fetchConfigurationDetails(id));
      dispatch(fetchConfigurationItems(id));
    }
    setActionLoading(false);
  };

  const handleSimulation = () => {
    if (!config) return;
    if (isSimulationRunning) {
      dispatch(stopSimulation({ id }));
    } else {
      dispatch(startSimulation({ id }));
    }
  };

  const handleGenerateSlots = async () => {
    if (!config) return;
    const result = await dispatch(generateSlots(config.id));
    if (generateSlots.fulfilled.match(result)) {
      dispatch(fetchConfigurationItems(id));
    }
  };

  const handleItemClick = (id) => {
    navigate(`/self-scheduling-items/${id}`);
  };
  return (
    <>
      <PageMeta
        title="Configuration Details"
        description="Configuration information"
      />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={(event) => {
              event.stopPropagation();
              navigate("/self-scheduling-configurations");
            }}
            className="text-gray-400 text-2xl flex mr-10 hover:text-gray-800"
          >
            <ChevronLeftIcon className="inline-block" />
          </button>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            Configuration Details
          </h2>
        </div>
        <nav>
          <ol className="flex items-center gap-1.5">
            <li>
              <Link
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
                to="/"
              >
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
            <li className="text-sm text-gray-800 dark:text-white/90">
              Configuration Details
            </li>
          </ol>
        </nav>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {status === "loading" ? (
        <Spinner />
      ) : (
        config && (
          <div className="grid grid-cols-12 gap-6 mt-6">
            <div className="col-span-8">
              <ConfigurationInfoCard
                config={config}
                onAction={handleAction}
                actionLoading={actionLoading}
              />
            </div>
            <div className="col-span-4">
              <SimulationWidget
                isSimulationRunning={isSimulationRunning}
                handleSimulation={handleSimulation}
                disabled={!config.isRunning}
              />
            </div>
          </div>
        )
      )}

      <div className="grid grid-cols-12 gap-6 mt-6">
        <div className="col-span-8">
          <TourItemList
            onItemSelection={handleItemClick}
            items={items}
            itemsStatus={itemsStatus}
            itemsError={itemsError}
            highlightId={highlightId}
            generateSlots={handleGenerateSlots}
            slotsStatus={slotsStatus}
          ></TourItemList>
        </div>
        <div className="col-span-4 ">
          <NotificationsWidget />
        </div>
      </div>
    </>
  );
}
