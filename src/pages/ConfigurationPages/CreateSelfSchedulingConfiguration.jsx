import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
  fetchCities,
  fetchExperiences,
  fetchGuides,
  createConfiguration as createConfigurationThunk,
} from "../../store/createConfigurationSlice.js";
import PageBreadcrumb from "../../components/common/PageBreadCrumb.jsx";
import PageMeta from "../../components/common/PageMeta.jsx";
import Form from "../../components/form/Form.jsx";
import Label from "../../components/form/Label.jsx";
import Select from "../../components/form/Select.jsx";
import InputField from "../../components/form/input/InputField.jsx";
import MyDateRangePicker from "../../components/form/DateRangePicker.jsx";
import Button from "../../components/ui/button/Button.jsx";
import Spinner from "../../components/ui/spinner/Spinner.jsx";
import SelectableListModal from "../../components/common/SelectableListModal.jsx";
import {
  TableCellHeader,
  TableCell,
  TableRow,
} from "../../components/ui/table/index.jsx";

export default function CreateSelfSchedulingConfiguration() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cities, experiences, guides, createStatus, createError } =
    useSelector((state) => state.configForm);

  const [cityId, setCityId] = useState("");
  const [description, setDescription] = useState("");
  const [schedulingRange, setSchedulingRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [toursRange, setToursRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [selectedExperienceIds, setSelectedExperienceIds] = useState([]);
  const [selectedGuideIds, setSelectedGuideIds] = useState([]);
  const [error, setError] = useState("");
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  minDate.setHours(0, 0, 0, 0);

  const fetchGuidesForExperiences = (expIds) => {
    if (!cityId || !toursRange.startDate || !toursRange.endDate) return;
    dispatch(
      fetchGuides({
        cityId: parseInt(cityId),
        experienceIds: expIds.map((id) => parseInt(id)),
        allocationPeriod: {
          start: toursRange.startDate
            ? toursRange.startDate.toISOString().split("T")[0]
            : undefined,
          end: toursRange.endDate
            ? toursRange.endDate.toISOString().split("T")[0]
            : undefined,
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
    if (!cityId || !toursRange.startDate || !toursRange.endDate) return;
    const city = cities.find((c) => c.id === parseInt(cityId));
    const cityNameParam = city?.name || "";
    dispatch(fetchExperiences({ cityName: cityNameParam }));
  }, [dispatch, cityId, cities, toursRange.startDate, toursRange.endDate]);

  const validate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (
      !cityId ||
      !description ||
      !schedulingRange.startDate ||
      !schedulingRange.endDate ||
      !toursRange.startDate ||
      !toursRange.endDate ||
      selectedExperienceIds.length === 0 ||
      selectedGuideIds.length === 0
    ) {
      console.error("Validation failed");
      setError("All fields are required");
      return false;
    }

    const schedStartDate = new Date(schedulingRange.startDate);
    const schedEndDate = new Date(schedulingRange.endDate);
    const tourStartDate = new Date(toursRange.startDate);

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
      schedulingWindowStart: schedulingRange.startDate
        ?.toISOString()
        .split("T")[0],
      schedulingWindowEnd: schedulingRange.endDate?.toISOString().split("T")[0],
      toursPeriodStart: toursRange.startDate?.toISOString().split("T")[0],
      toursPeriodEnd: toursRange.endDate?.toISOString().split("T")[0],
      experienceIds: selectedExperienceIds.map((id) => parseInt(id)),
      guideIds: selectedGuideIds.map((id) => parseInt(id)),
    };
    const res = await dispatch(createConfigurationThunk(payload));
    if (createConfigurationThunk.fulfilled.match(res)) { 
      const newId = res.payload && res.payload.id ? res.payload.id : undefined;
      navigate(`/self-scheduling-configurations/${newId}`);
      return;
    } else if (res.payload) {
      setError(res.payload);
    } else {
      setError("Failed to create configuration");
    }
  };

  return (
    <>
      <PageMeta
        title="Add Self Scheduling Configuration"
        description="Create new configuration"
      />
      <PageBreadcrumb pageTitle="Add Self Scheduling Configuration" />
      {error && <p className="text-red-500 mb-3">{error}</p>}
      {createError && <p className="text-red-500 mb-3">{createError}</p>}
      {!cities ? (
        <Spinner />
      ) : (
        <Form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label>City</Label>
            <Select
              options={cities.map((c) => ({ value: c.id, label: c.name }))}
              placeholder="Select city"
              onChange={(val) => {
                setCityId(val);
              }}
              disabled={createStatus === "loading"}
            />
          </div>
          <div>
            <Label htmlFor="desc">Description</Label>
            <InputField
              disabled={createStatus === "loading"}
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MyDateRangePicker
              disabled={createStatus === "loading"}
              id="schedulingRange"
              label="Scheduling Window"
              value={schedulingRange}
              minDate={minDate}
              maxDate={
                toursRange.startDate
                  ? (() => {
                      const d = new Date(toursRange.startDate);
                      d.setDate(d.getDate() - 1);
                      return d;
                    })()
                  : undefined
              }
              onChange={(val) => {
                setSchedulingRange(val);
              }}
            />

            <MyDateRangePicker
              disabled={createStatus === "loading"}
              id="toursRange"
              label="Tours Period"
              value={toursRange}
              minDate={
                schedulingRange.endDate
                  ? (() => {
                      const d = new Date(schedulingRange.endDate);
                      d.setDate(d.getDate() + 1);
                      return d;
                    })()
                  : minDate
              }
              onChange={(val) => {
                setToursRange(val);
              }}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <SelectableListModal
                disabled={createStatus === "loading"}
                title="Experiences"
                items={experiences}
                selected={selectedExperienceIds}
                onChange={handleExperienceChange}
                renderLabel={(item) => (
                  <div className="leading-snug">
                    <div className="dark:text-white font-medium truncate">
                      {item.name}
                    </div>
                    <div className="text-theme-xs text-gray-400 dark:text-gray-400">
                      {item.id}
                    </div>
                  </div>
                )}
                renderRow={(item) => (
                  <TableCell>
                    <div className="leading-snug">
                      <div className="dark:text-white font-medium truncate">
                        {item.name}
                      </div>
                      <div className="text-theme-xs text-gray-400 dark:text-gray-400">
                        {item.id}
                      </div>
                    </div>
                  </TableCell>
                )}
                renderHeader={() => (
                  <TableRow>
                    <TableCellHeader>Name / ID</TableCellHeader>
                  </TableRow>
                )}
              />
            </div>
            <div>
              <SelectableListModal
                disabled={createStatus === "loading"}
                title="Guides"
                items={guides}
                selected={selectedGuideIds}
                onChange={handleGuideChange}
                renderLabel={(item) => (
                  <div className="leading-snug">
                    <div className="dark:text-white font-medium truncate">
                      {item.name}
                    </div>
                    <div className="text-theme-xs text-gray-400 dark:text-gray-400">
                      {item.id}
                    </div>
                  </div>
                )}
                renderRow={(item) => (
                  <TableCell>
                    <div className="leading-snug">
                      <div className="dark:text-white font-medium truncate">
                        {item.name}
                      </div>
                      <div className="text-theme-xs text-gray-400 dark:text-gray-400">
                        {item.id}
                      </div>
                    </div>
                  </TableCell>
                )}
                renderHeader={() => (
                  <TableRow>
                    <TableCellHeader>Name / ID</TableCellHeader>
                  </TableRow>
                )}
              />
            </div>
          </div>
          <div>
            <Button
              disabled={createStatus === "loading"}
              type="submit"
              className="bg-brand-500 text-white hover:bg-brand-600"
            >
              Create
            </Button>
          </div>
        </Form>
      )}
    </>
  );
}
