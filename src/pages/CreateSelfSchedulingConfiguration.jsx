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
import Button from "../components/ui/button/Button";
import SelectableListModal from "../components/common/SelectableListModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import Checkbox from "../components/form/input/Checkbox";

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

  const fetchGuidesForExperiences = (expIds) => {
    if (!cityId) return;
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

  const handleExperienceCheck = (id, checked) => {
    const newIds = checked
      ? [...selectedExperienceIds, id]
      : selectedExperienceIds.filter((eid) => eid !== id);
    setSelectedExperienceIds(newIds);
    fetchGuidesForExperiences(newIds);
  };

  const handleGuideCheck = (id, checked) => {
    const newIds = checked
      ? [...selectedGuideIds, id]
      : selectedGuideIds.filter((gid) => gid !== id);
    setSelectedGuideIds(newIds);
  };

  useEffect(() => {
    dispatch(fetchCities());
  }, [dispatch]);

  useEffect(() => {
    if (!cityId) return;
    const city = cities.find((c) => c.id === parseInt(cityId));
    const cityNameParam = city?.name || "";
    dispatch(fetchExperiences({ cityName: cityNameParam }));
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <SelectableListModal
              title="Experiences"
              items={experiences}
              selected={selectedExperienceIds}
              onChange={setSelectedExperienceIds}
              renderRow={(item) =>
                <TableCell className="px-6 py-3 whitespace-nowrap">
                  <div className="leading-snug">
                    <div className="dark:text-white font-medium truncate">{item.name}</div>
                    <div className="text-theme-xs text-gray-400 dark:text-gray-400">{item.id}</div>
                  </div>
                </TableCell>
              }
              renderHeader={() => (
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-6 py-3 whitespace-nowrap"
                  > <div className="flex items-center">
                      <p className="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Name / ID</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            />
          </div>
          <div>
            <SelectableListModal
              title="Guides"
              items={guides}
              selected={selectedGuideIds}
              onChange={setSelectedGuideIds}
              renderRow={(item) =>
                <TableCell className="px-6 py-3 whitespace-nowrap">
                  <div className="leading-snug">
                    <div className="dark:text-white font-medium truncate">{item.name}</div>
                    <div className="text-theme-xs text-gray-400 dark:text-gray-400">{item.id}</div>
                  </div>
                </TableCell>
              }
              renderHeader={() => (
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-6 py-3 whitespace-nowrap"
                  > <div className="flex items-center">
                      <p className="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Name / ID</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            />
          </div>
        </div>
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] mt-6">
            <div className="max-w-full overflow-x-auto">
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] text-xs">
                  <TableRow>
                    <TableCell isHeader className="px-3 py-2"></TableCell>
                    <TableCell
                      isHeader
                      className="px-6 py-3 whitespace-nowrap"
                    >
                      <div className="flex items-center">
                        <p className="font-medium text-gray-500 text-theme-xs dark:text-gray-400"> Name / ID</p>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05] text-xs">
                  {experiences.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="px-6 py-3 whitespace-nowrap">
                        <Checkbox
                          checked={selectedExperienceIds.includes(item.id)}
                          onChange={(chk) => handleExperienceCheck(item.id, chk)}
                        /></TableCell>
                      <TableCell className="px-6 py-3 whitespace-nowrap">
                        <div className="leading-snug">
                          <div className="dark:text-white font-medium truncate">{item.name}</div>
                          <div className="text-theme-xs text-gray-400 dark:text-gray-400">{item.id}</div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] mt-6">
            <div className="max-w-full overflow-x-auto">
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] text-xs">
                  <TableRow>
                    <TableCell isHeader className="px-3 py-2"></TableCell>
                    <TableCell
                      isHeader
                      className="px-6 py-3 whitespace-nowrap"
                    >
                      <div className="flex items-center">
                        <p className="font-medium text-gray-500 text-theme-xs dark:text-gray-400"> Name / ID</p>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05] text-xs">
                  {guides.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="px-6 py-3 whitespace-nowrap">
                        <Checkbox
                          checked={selectedGuideIds.includes(item.id)}
                          onChange={(chk) => handleGuideCheck(item.id, chk)}
                        /></TableCell>
                      <TableCell className="px-6 py-3 whitespace-nowrap">
                        <div className="leading-snug">
                          <div className="dark:text-white font-medium truncate">{item.name}</div>
                          <div className="text-theme-xs text-gray-400 dark:text-gray-400">{item.id}</div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div> */}
        <div>
          <Button type="submit" className="bg-brand-500 text-white hover:bg-brand-600" >Create</Button>
        </div>
      </Form>
    </>
  );
}
