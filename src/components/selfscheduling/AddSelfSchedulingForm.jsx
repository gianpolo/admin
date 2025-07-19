import Form from "../form/Form";
import Label from "../form/Label";
import Select from "../form/Select";
import InputField from "../form/input/InputField";
import MyDateRangePicker from "../form/DateRangePicker";
import SelectableListModal from "../common/SelectableListModal";
import Button from "../ui/button/Button";
import { TableRow, TableCell, TableCellHeader } from "../ui/table";
export default function AddSelfSchedulingForm({
  handleSubmit,
  cityId,
  cities,
  experiences,
  guides,
  description,
  setDescription,
  schedulingWindow,
  setSchedulingWindow,
  toursPeriod,
  setToursPeriod,
  setCityId,
  handleExperienceChange,
  handleGuideChange,
  selectedExperienceIds,
  selectedGuideIds,
  loading,
}) {
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  minDate.setHours(0, 0, 0, 0);

  return (
    <Form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="grid-col">
          <Label>City</Label>
          <Select
            options={cities.map((c) => ({ value: c.id, label: c.name }))}
            defaultValue={cityId}
            placeholder="Select city"
            onChange={(val) => {
              console.log(val);
              setCityId(val);
            }}
            disabled={loading}
          />
        </div>
        <div className="grid-col">
          <Label htmlFor="desc">Description</Label>
          <InputField
            disabled={loading}
            id="desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="grid-col">
          <MyDateRangePicker
            disabled={loading}
            id="schedulingWindow"
            label="Scheduling Window"
            value={schedulingWindow}
            minDate={minDate}
            maxDate={
              toursPeriod.startDate
                ? (() => {
                    const d = new Date(toursPeriod.startDate);
                    d.setDate(d.getDate() - 1);
                    return d;
                  })()
                : undefined
            }
            onChange={(val) => {
              setSchedulingWindow(val);
            }}
          />
        </div>
        <div className="grid-col">
          <MyDateRangePicker
            disabled={loading}
            id="toursPeriod"
            label="Tours Period"
            value={toursPeriod}
            minDate={
              schedulingWindow.endDate
                ? (() => {
                    const d = new Date(schedulingWindow.endDate);
                    d.setDate(d.getDate() + 1);
                    return d;
                  })()
                : minDate
            }
            onChange={(val) => {
              setToursPeriod(val);
            }}
          />
        </div>
        <div className="grid-col">
          <SelectableListModal
            disabled={loading}
            title="Experiences"
            items={experiences}
            selected={selectedExperienceIds}
            onChange={handleExperienceChange}
            renderLabel={(item) => (
              <div className="leading-snug">
                <div className="dark:text-white font-medium truncate">{item.name}</div>
                <div className="text-theme-xs text-gray-400 dark:text-gray-400">{item.id}</div>
              </div>
            )}
            renderRow={(item) => (
              <TableCell>
                <div className="leading-snug">
                  <div className="dark:text-white font-medium truncate">{item.name}</div>
                  <div className="text-theme-xs text-gray-400 dark:text-gray-400">{item.id}</div>
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
        <div className="grid-col">
          <SelectableListModal
            disabled={loading}
            title="Guides"
            items={guides}
            selected={selectedGuideIds}
            onChange={handleGuideChange}
            renderLabel={(item) => (
              <div className="leading-snug">
                <div className="dark:text-white font-medium truncate">{item.name}</div>
                <div className="text-theme-xs text-gray-400 dark:text-gray-400">{item.id}</div>
              </div>
            )}
            renderRow={(item) => (
              <TableCell>
                <div className="leading-snug">
                  <div className="dark:text-white font-medium truncate">{item.name}</div>
                  <div className="text-theme-xs text-gray-400 dark:text-gray-400">{item.id}</div>
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
        <Button disabled={loading} type="submit" className="bg-brand-500 text-white hover:bg-brand-600">
          Create
        </Button>
      </div>
    </Form>
  );
}
