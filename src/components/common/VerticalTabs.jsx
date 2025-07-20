import { useState, useEffect } from "react";

export default function VerticalTabs({ tabsData, addOn, onChangeTab, currentTabIndex }) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:gap-8 rounded-xl">
      <div className="sm:w-[400px] rounded-xl p-6 dark:bg-white/[0.03]">
        {addOn && <div className="pb-6 mb-6 border-b border-gray-700">{addOn}</div>}
        <nav className="flex flex-auto sm:flex-col sm:space-y-2 overflow-y-auto">
          {tabsData.map((tab, idx) => (
            <button
              key={idx}
              className={`inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ease-in-out sm:p-3 ${
                idx === currentTabIndex
                  ? " text-brand-500 dark:bg-brand-400/20 dark:text-brand-400 bg-brand-50"
                  : "py-2.5  bg-transparent text-gray-500 border-transparent hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
              onClick={() => onChangeTab(idx)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="flex-1">
        <div className="h-full w-full text-sm text-gray-500 dark:text-gray-400">
          {tabsData[currentTabIndex].content}
        </div>
      </div>
    </div>
  );
}
