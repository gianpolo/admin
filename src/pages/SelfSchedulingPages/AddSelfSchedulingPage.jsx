import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
  fetchCities,
  fetchExperiences,
  fetchGuides,
  createSelfScheduling as createSelfSchedulingThunk,
} from "../../store/selfschedulingFormSlice.js";
import PageBreadcrumb from "../../components/common/PageBreadCrumb.jsx";
import PageMeta from "../../components/common/PageMeta.jsx";
import Button from "../../components/ui/button/Button.jsx";
import Spinner from "../../components/ui/spinner/Spinner.jsx";
import ComponentCard from "../../components/common/ComponentCard.jsx";
import AddSelfSchedulingForm from "../../components/selfscheduling/AddSelfSchedulingForm.jsx";
const testConf = {
  cityId: 1,
  description: "test",
  schedulingWindow: {
    startDate: new Date("2025-08-01"),
    endDate: new Date("2025-08-06"),
  },
  toursPeriod: {
    startDate: new Date("2025-09-01"),
    endDate: new Date("2025-09-16"),
  },
  selectedExperienceIds: [11],
  selectedGuideIds: [3436, 1654, 5738],
};

export default function AddSelfSchedulingPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loadingTemplate, setLoadingTemplate] = useState(false);
  const { cities, experiences, guides, createStatus, createError } = useSelector((state) => state.selfschedulingForm);

  const [cityId, setCityId] = useState("");
  const [description, setDescription] = useState("");
  const [schedulingWindow, setSchedulingWindow] = useState({
    startDate: null,
    endDate: null,
  });
  const [toursPeriod, setToursPeriod] = useState({
    startDate: null,
    endDate: null,
  });
  const [selectedExperienceIds, setSelectedExperienceIds] = useState([]);
  const [selectedGuideIds, setSelectedGuideIds] = useState([]);
  const [error, setError] = useState("");

  const fetchGuidesForExperiences = (expIds) => {
    if (!cityId || !toursPeriod.startDate || !toursPeriod.endDate) return;
    dispatch(
      fetchGuides({
        cityId: parseInt(cityId),
        experienceIds: expIds.map((id) => parseInt(id)),
        allocationPeriod: {
          start: toursPeriod.startDate ? toursPeriod.startDate.toISOString().split("T")[0] : undefined,
          end: toursPeriod.endDate ? toursPeriod.endDate.toISOString().split("T")[0] : undefined,
        },
      })
    );
  };

  const handleExperienceChange = (ids) => {
    setSelectedExperienceIds(ids);
    fetchGuidesForExperiences(ids);
  };

  const handleGuideChange = (ids) => {
    setSelectedGuideIds(ids);
  };

  useEffect(() => {
    dispatch(fetchCities());
  }, [dispatch]);

  useEffect(() => {
    if (!cityId || !toursPeriod.startDate || !toursPeriod.endDate) return;

    const city = cities.find((c) => c.id === parseInt(cityId));

    const cityNameParam = city?.name || "";

    dispatch(fetchExperiences({ cityName: cityNameParam }));
  }, [dispatch, cityId, cities, toursPeriod.startDate, toursPeriod.endDate]);

  useEffect(() => {
    if (cityId && toursPeriod.startDate && toursPeriod.endDate && selectedExperienceIds.length > 0) {
      dispatch(
        fetchGuides({
          cityId: parseInt(cityId, 10),
          experienceIds: selectedExperienceIds.map((id) => parseInt(id, 10)),
          allocationPeriod: {
            start: toursPeriod.startDate.toISOString().split("T")[0],
            end: toursPeriod.endDate.toISOString().split("T")[0],
          },
        })
      );
    }
  }, [dispatch, cityId, toursPeriod.startDate, toursPeriod.endDate, selectedExperienceIds]);

  useEffect(() => {
    if (loadingTemplate && guides && guides.length > 0) {
      setSelectedGuideIds(testConf.selectedGuideIds);
      setLoadingTemplate(false);
    }
  }, [loadingTemplate, guides]);

  const validate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (
      !cityId ||
      !description ||
      !schedulingWindow.startDate ||
      !schedulingWindow.endDate ||
      !toursPeriod.startDate ||
      !toursPeriod.endDate ||
      selectedExperienceIds.length === 0 ||
      selectedGuideIds.length === 0
    ) {
      console.error("Validation failed");
      setError("All fields are required");
      return false;
    }

    const schedStartDate = new Date(schedulingWindow.startDate);
    const schedEndDate = new Date(schedulingWindow.endDate);
    const tourStartDate = new Date(toursPeriod.startDate);

    if (schedStartDate <= today || schedEndDate <= today) {
      setError("Scheduling window must be in the future");
      return false;
    }

    if (tourStartDate <= schedEndDate) {
      setError("Tours period must be after scheduling window");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const payload = {
      cityId: parseInt(cityId),
      description,
      schedulingWindowStart: schedulingWindow.startDate?.toISOString().split("T")[0],
      schedulingWindowEnd: schedulingWindow.endDate?.toISOString().split("T")[0],
      toursPeriodStart: toursPeriod.startDate?.toISOString().split("T")[0],
      toursPeriodEnd: toursPeriod.endDate?.toISOString().split("T")[0],
      experienceIds: selectedExperienceIds.map((id) => parseInt(id)),
      guideIds: selectedGuideIds.map((id) => parseInt(id)),
    };
    const res = await dispatch(createSelfSchedulingThunk(payload));
    if (createSelfSchedulingThunk.fulfilled.match(res)) {
      const newId = res.payload && res.payload.value ? res.payload.value : undefined;
      if (newId !== undefined) {
        navigate(`/self-schedulings/${newId}`);
      }
      return;
    } else if (res.payload) {
      setError(res.payload);
    } else {
      setError("Failed to create configuration");
    }
  };
  const loadTemplate = () => {
    const c = cities.find((c) => c.id === testConf.cityId);
    if (!c) return;
    setCityId(String(c.id));
    setDescription(testConf.description);
    setSchedulingWindow(testConf.schedulingWindow);
    setToursPeriod(testConf.toursPeriod);
    setSelectedExperienceIds(testConf.selectedExperienceIds);
    setLoadingTemplate(true);
  };

  return (
    <>
      <PageMeta title="Add Self Scheduling Configuration" description="Create new configuration" />
      <PageBreadcrumb pageTitle="Add new Self Scheduling" />
      {error && <p className="text-red-500 mb-3">{error}</p>}
      {createError && <p className="text-red-500 mb-3">{createError}</p>}
      {!cities ? (
        <div className="mt-6 flex h-full justify-center">
          <Spinner description="Loading Cities" />
        </div>
      ) : (
        <ComponentCard
          title={
            <div className="flex justify-between items-center">
              <div className="flex-auto">Configuration</div>
              <div>
                <Button size="xs" onClick={loadTemplate}>
                  Load Template
                </Button>
              </div>
            </div>
          }
        >
          <AddSelfSchedulingForm
            cityId={cityId}
            cities={cities}
            description={description}
            setDescription={setDescription}
            schedulingWindow={schedulingWindow}
            setSchedulingWindow={setSchedulingWindow}
            toursPeriod={toursPeriod}
            setToursPeriod={setToursPeriod}
            handleSubmit={handleSubmit}
            selectedExperienceIds={selectedExperienceIds}
            selectedGuideIds={selectedGuideIds}
            handleExperienceChange={handleExperienceChange}
            handleGuideChange={handleGuideChange}
            loading={createStatus === "loading"}
            experiences={experiences}
            guides={guides}
          />
        </ComponentCard>
      )}
    </>
  );
}
