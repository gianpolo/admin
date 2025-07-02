import { useState } from "react";

export function VerticalTabs({ tabsData }) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  return (
    <div className="rounded-xl border border-gray-200 p-6 dark:border-gray-800">
      <div className="flex">
        <nav className="-mb-px flex w-48 flex-col border-r border-gray-200 dark:border-gray-800">
          {tabsData.map((tab, idx) => (
            <button
              key={idx}
              className={`border-l-2 px-2.5 py-2 text-left text-sm font-medium transition-colors duration-200 ease-in-out ${
                idx === activeTabIndex
                  ? "text-brand-500 dark:text-brand-400 border-brand-500 dark:border-brand-400"
                  : "text-gray-500 border-transparent hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
              onClick={() => setActiveTabIndex(idx)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="flex-1 pl-6">
          <h3 className="mb-1 text-xl font-medium text-gray-800 dark:text-white/90">
            {tabsData[activeTabIndex].label}
          </h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {tabsData[activeTabIndex].content}
          </div>
        </div>
      </div>
    </div>
  );
}
