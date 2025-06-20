import { useState, useEffect } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import Form from "../components/form/Form";
import Label from "../components/form/Label";
import Select from "../components/form/Select";
import InputField from "../components/form/input/InputField";
import DatePicker from "../components/form/date-picker.jsx";
import MultiSelect from "../components/form/MultiSelect";
import Button from "../components/ui/button/Button";

const getToken = () => localStorage.getItem("token") || "";
const backend_url = import.meta.env.REACT_APP_BACKEND_URL || "http://localhost:5005/api/v1";

export default function CreateSelfSchedulingConfiguration() {
  const [cities, setCities] = useState([]);
  const [cityId, setCityId] = useState("");
  const [cityName, setCityName] = useState("");
  const [description, setDescription] = useState("");
  const [schedStart, setSchedStart] = useState("");
  const [schedEnd, setSchedEnd] = useState("");
  const [tourStart, setTourStart] = useState("");
  const [tourEnd, setTourEnd] = useState("");
  const [experiences, setExperiences] = useState([]);
  const [selectedExperienceIds, setSelectedExperienceIds] = useState([]);
  const [guides, setGuides] = useState([]);
  const [selectedGuideIds, setSelectedGuideIds] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function loadCities() {
      try {
        const token = getToken();
        const res = await fetch(`${backend_url}/cities`, {
          headers: { "Authorization": `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setCities(data || []);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadCities();
  }, []);

  useEffect(() => {
    async function loadData() {
      if (!cityId || !schedStart || !schedEnd || !tourStart || !tourEnd) return;
      try {
        const token = getToken();
        const city = cities.find((c) => c.id === parseInt(cityId));
        const cityNameParam = city?.name || "";
        const expRes = await fetch(
          `${backend_url}/tours?cityName=${encodeURIComponent(cityNameParam)}&pageSize=20&pageNumber=1`,
          { headers: { "Authorization": `Bearer ${token}` } }
        );
        if (expRes.ok) {
          const expData = await expRes.json();
          setExperiences(expData.items || []);
        }
        const guideRes = await fetch(
          `${backend_url}/guides?cityId=${cityId}&pageSize=20&pageNumber=1`,
          { headers: { "Authorization": `Bearer ${token}` } }
        );
        if (guideRes.ok) {
          const guideData = await guideRes.json();
          setGuides(guideData.items || []);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadData();
  }, [cityId, schedStart, schedEnd, tourStart, tourEnd, cities]);

  const validate = () => {
    const today = new Date().toISOString().slice(0, 10);
    if (!cityId || !description || !schedStart || !schedEnd || !tourStart || !tourEnd) {
      setError("All fields are required");
      return false;
    }
    if (schedStart <= today || schedEnd <= today) {
      setError("Scheduling window must be in the future");
      return false;
    }
    if (tourStart <= schedEnd) {
      setError("Tours period must be after scheduling window");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      const payload = {
        cityId: parseInt(cityId),
        description,
        schedulingWindowStart: schedStart,
        schedulingWindowEnd: schedEnd,
        toursPeriodStart: tourStart,
        toursPeriodEnd: tourEnd,
        experienceIds: selectedExperienceIds.map((id) => parseInt(id)),
        guideIds: selectedGuideIds.map((id) => parseInt(id)),
      };
      const token = getToken();
      const res = await fetch(`${backend_url}/configuration`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSuccess(true);
      } else {
        const t = await res.text();
        setError(t || "Failed to create configuration");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <PageMeta title="Add Self Scheduling Configuration" description="Create new configuration" />
      <PageBreadcrumb pageTitle="Add Self Scheduling Configuration" />
      {error && <p className="text-red-500 mb-3">{error}</p>}
      {success && <p className="text-green-500 mb-3">Configuration created</p>}
      <Form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label>City</Label>
          <Select
            options={cities.map((c) => ({ value: c.id, label: c.name }))}
            placeholder="Select city"
            onChange={(val) => {
              setCityId(val);
              const c = cities.find((ci) => ci.id === parseInt(val));
              setCityName(c?.name || "");
            }}
          />
        </div>
        <div>
          <Label htmlFor="desc">Description</Label>
          <InputField id="desc" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <DatePicker
            id="schedule-range"
            mode="range"
            label="Scheduling Window"
            placeholder="Select date range"
            onChange={(selectedDates, dateStr) => {
              const [start, end] = dateStr.split(" to ");
              setSchedStart(start || "");
              setSchedEnd(end || "");
            }}
          />
        </div>
        <div>
          <DatePicker
            id="tours-range"
            mode="range"
            label="Tours Period"
            placeholder="Select date range"
            onChange={(selectedDates, dateStr) => {
              const [start, end] = dateStr.split(" to ");
              setTourStart(start || "");
              setTourEnd(end || "");
            }}
          />
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
