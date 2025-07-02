import { useState } from "react";

export function Tabs({ tabsData }) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  return (
    <div className="rounded-xl border border-gray-200 p-6 dark:border-gray-800">
      <nav className="-mb-px flex space-x-2 overflow-x-auto">
        {tabsData.map((tab, idx) => {
          return (
            <button
              key={idx}
              className={`inline-flex items-center border-b-2 px-2.5 py-2 text-sm font-medium transition-colors duration-200 ease-in-out ${
                idx === activeTabIndex
                  ? "text-brand-500 dark:text-brand-400 border-brand-500 dark:border-brand-400"
                  : "bg-transparent text-gray-500 border-transparent hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
              // Change the active tab on click.
              onClick={() => setActiveTabIndex(idx)}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
      {/* Show active tab content. */}
      <div className="pt-4 dark:border-gray-800">
        <h3 className="mb-1 text-xl font-medium text-gray-800 dark:text-white/90">
          {tabsData[activeTabIndex].label}
        </h3>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          {tabsData[activeTabIndex].content}
        </div>
      </div>
    </div>
  );
}
