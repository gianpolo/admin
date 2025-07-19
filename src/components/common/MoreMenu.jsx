import { useState, useEffect } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";

export default function MoreMenu({ menuItems }) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  useEffect(() => {
    const visible = menuItems && menuItems.length > 0;
    setMenuVisible(visible);
  }, [menuItems]);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }
  function closeDropdown() {
    setIsOpen(false);
  }
  return (
    <>
      {menuVisible && (
        <div className="relative inline-block">
          <button className="dropdown-toggle" onClick={toggleDropdown}>
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
          </button>
          <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2">
            {menuItems.map((item) => (
              <DropdownItem
                key={item.action}
                onItemClick={() => item.action()}
                className={`flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300 ${
                  item.disabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={item.disabled}
              >
                {item.label}
              </DropdownItem>
            ))}
          </Dropdown>
        </div>
      )}
    </>
  );
}
