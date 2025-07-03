import { useState, useEffect, useRef } from "react";

export default function VerticalTabs({ tabsData, addOn }) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(null);

  useEffect(() => {
    setActiveTabIndex(0);
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.clientHeight);
    }
  }, [activeTabIndex, tabsData]);
  return (
    <div className="rounded-xl">
      <div className="flex flex-col gap-6 sm:flex-row sm:gap-6 items-start">
        <div
          className="pb-2 sm:w-[300px] rounded-xl p-6 dark:bg-white/[0.03] overflow-y-auto"
          style={contentHeight ? { maxHeight: contentHeight } : undefined}
        >
          <nav className="flex w-full flex-row sm:flex-col sm:space-y-2">
            {addOn && (
              <div className="pb-6 mb-6 border-b border-gray-800">{addOn}</div>
            )}
            {tabsData.map((tab, idx) => (
              <button
                key={idx}
                className={`inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ease-in-out sm:p-3 ${
                  idx === activeTabIndex
                    ? " text-brand-500 dark:bg-brand-400/20 dark:text-brand-400 bg-brand-50"
                    : "py-2.5  bg-transparent text-gray-500 border-transparent hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
                onClick={() => setActiveTabIndex(idx)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <div ref={contentRef} className="flex-1">
          <div className="h-full w-full text-sm text-gray-500 dark:text-gray-400">
            {tabsData[activeTabIndex].content}
          </div>
        </div>
      </div>
    </div>
  );
}
