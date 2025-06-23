import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCities,
  fetchExperiences,
  fetchGuides,
  createConfiguration as createConfigurationThunk,
} from "../store/createConfigurationSlice.js";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import Form from "../components/form/Form";
import Label from "../components/form/Label";
import Select from "../components/form/Select";
import InputField from "../components/form/input/InputField";
import MyDateRangePicker from "../components/form/DateRangePicker";
import MultiSelect from "../components/form/MultiSelect";
import Button from "../components/ui/button/Button";

export default function CreateSelfSchedulingConfiguration() {
  const dispatch = useDispatch();
  const { cities, experiences, guides, createStatus, createError } = useSelector(
    (state) => state.configForm
  );

  const [cityId, setCityId] = useState("");
  const [description, setDescription] = useState("");
  const [schedulingRange, setSchedulingRange] = useState({ startDate: null, endDate: null });
  const [toursRange, setToursRange] = useState({ startDate: null, endDate: null });
  const [selectedExperienceIds, setSelectedExperienceIds] = useState([]);
  const [selectedGuideIds, setSelectedGuideIds] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  minDate.setHours(0, 0, 0, 0);

  useEffect(() => {
    dispatch(fetchCities());
  }, [dispatch]);

  useEffect(() => {
    if (!cityId) return;
    const city = cities.find((c) => c.id === parseInt(cityId));
    const cityNameParam = city?.name || "";
    dispatch(fetchExperiences({ cityName: cityNameParam }));
    dispatch(fetchGuides({ cityId }));
  }, [dispatch, cityId, cities]);

  const validate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (
      !cityId ||
      !description ||
      !schedulingRange.startDate ||
      !schedulingRange.endDate ||
      !toursRange.startDate ||
      !toursRange.endDate
    ) {
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
      schedulingWindowStart: schedulingRange.startDate?.toISOString().split("T")[0],
      schedulingWindowEnd: schedulingRange.endDate?.toISOString().split("T")[0],
      toursPeriodStart: toursRange.startDate?.toISOString().split("T")[0],
      toursPeriodEnd: toursRange.endDate?.toISOString().split("T")[0],
      experienceIds: selectedExperienceIds.map((id) => parseInt(id)),
      guideIds: selectedGuideIds.map((id) => parseInt(id)),
    };
    const res = await dispatch(createConfigurationThunk(payload));
    if (createConfigurationThunk.fulfilled.match(res)) {
      setSuccess(true);
    } else if (res.payload) {
      setError(res.payload);
    } else {
      setError("Failed to create configuration");
    }
  };
   
  return (
    <>
      <PageMeta title="Add Self Scheduling Configuration" description="Create new configuration" />
      <PageBreadcrumb pageTitle="Add Self Scheduling Configuration" />
      {error && <p className="text-red-500 mb-3">{error}</p>}
      {createError && <p className="text-red-500 mb-3">{createError}</p>}
      {success && <p className="text-green-500 mb-3">Configuration created</p>}
      <Form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label>City</Label>
          <Select
            options={cities.map((c) => ({ value: c.id, label: c.name }))}
            placeholder="Select city"
            onChange={(val) => {
              setCityId(val);
            }}
          />
        </div>
        <div>
          <Label htmlFor="desc">Description</Label>
          <InputField id="desc" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <MyDateRangePicker
              id="schedulingRange"
              label="Scheduling Window"
              value={schedulingRange}
              minDate={minDate}
              maxDate={toursRange.startDate ? (() => { const d = new Date(toursRange.startDate); d.setDate(d.getDate() - 1); return d; })() : undefined}
              onChange={(val) => {
                setSchedulingRange(val);
              }}
            />
          </div>
          <div>
            <MyDateRangePicker
              id="toursRange"
              label="Tours Period"
              value={toursRange}
              minDate={schedulingRange.endDate ? (() => { const d = new Date(schedulingRange.endDate); d.setDate(d.getDate() + 1); return d; })() : minDate}
              onChange={(val) => {
                setToursRange(val);
              }}
            />
          </div>
        </div>
        <div>
          <MultiSelect
            label="Experiences"
            options={experiences.map((e) => ({ value: e.id, text: e.name }))}
            onChange={(vals) => setSelectedExperienceIds(vals)}
            defaultSelected={selectedExperienceIds}
          />
        </div>
        <div>
          <MultiSelect
            label="Guides"
            options={guides.map((g) => ({ value: g.guide.id, text: g.guide.name }))}
            onChange={(vals) => setSelectedGuideIds(vals)}
            defaultSelected={selectedGuideIds}
          />
        </div>
        <div>
          <Button type="submit" className="bg-brand-500 text-white hover:bg-brand-600" >Create</Button>
        </div>
      </Form>
    </>
  );
}
