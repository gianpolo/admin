import { useEffect, useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
export default function SnapshotActionsMenu({ canActivate, canGenerateSlots, onActivateSnapshot, onGenerateSlots }) {
  const [isOpen, setIsOpen] = useState(false);
  function toggleDropdown() {
    setIsOpen(!isOpen);
  }
  function closeDropdown() {
    setIsOpen(false);
  }
  return (
    <div className="relative inline-block">
      <button className="dropdown-toggle" onClick={toggleDropdown}>
        <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
      </button>
      <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2">
        {canActivate && (
          <DropdownItem
            onItemClick={() => {
              onActivateSnapshot();
              closeDropdown();
            }}
            className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
          >
            Activate
          </DropdownItem>
        )}
        {canGenerateSlots && (
          <DropdownItem
            onItemClick={() => {
              onGenerateSlots();
              closeDropdown();
            }}
            className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
          >
            Generate Slots
          </DropdownItem>
        )}
      </Dropdown>
    </div>
  );
}
