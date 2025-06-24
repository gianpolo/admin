import { useState, useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Checkbox from "../form/input/Checkbox";
import { Table, TableBody, TableHeader, TableRow } from "../ui/table";
export default function SelectableListModal({
  items,
  selected = [],
  onChange,
  renderRow,
  renderHeader,
  getId = (item) => item.id,
  renderLabel = (item) => item.name,
  title,
  disabled = false,
}) {
  const { isOpen, openModal, closeModal } = useModal();
  const [tempSelected, setTempSelected] = useState(selected);

  useEffect(() => {
    if (isOpen) {
      setTempSelected(selected);
    }
  }, [isOpen, selected]);

  const toggleItem = (id) => {
    setTempSelected((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    onChange?.(tempSelected);
    closeModal();
  };

  items = items || [];
  const selectedItems = items.filter((it) => selected.includes(getId(it)));

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/[0.05]">
        <div className="font-medium text-gray-700 dark:text-gray-300">
          {title}
        </div>
        {!disabled && (
          <Button
            size="sm"
            onClick={openModal}
            disabled={!items || items.length == 0}
          >
            Add
          </Button>
        )}
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] text-xs">
            {selectedItems && selectedItems.length > 0 && renderHeader()}
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05] text-xs">
            {selectedItems.map((item) => (
              <TableRow key={getId(item)}>{renderRow(item)}</TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Modal
        showCloseButton={false}
        isOpen={isOpen}
        onClose={closeModal}
        className="m-10 h-md w-lg rounded-3xl bg-white p-6 dark:bg-gray-900  "
      >
        <div className="bg-white rounded-3xl dark:bg-gray-900">
          <h4 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
            {title}
          </h4>
          <div className="overflow-y-auto py-5 max-h-100 px-5">
            {items.map((item) => {
              const id = getId(item);
              return (
                <div
                  key={id}
                  className="flex items-center justify-between py-1 border-b border-gray-100 dark:border-gray-800 last:border-b-0"
                >
                  <span className="text-sm text-gray-700 dark:text-gray-200">
                    {renderLabel(item)}
                  </span>
                  <Checkbox
                    checked={tempSelected.includes(id)}
                    onChange={() => toggleItem(id)}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button size="sm" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleConfirm}>
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
