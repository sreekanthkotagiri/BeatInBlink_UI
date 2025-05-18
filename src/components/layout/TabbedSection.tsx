import React from 'react';

interface TabbedSectionProps<T extends string> {
  tabs: ReadonlyArray<{ key: T; label: string }>; 
  activeTab: T;
  onTabChange: (tab: T) => void;
}

function TabbedSection<T extends string>({ tabs, activeTab, onTabChange }: TabbedSectionProps<T>) {
  return (
    <div className="flex gap-6 mb-6 border-b">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`pb-2 border-b-4 capitalize text-sm font-semibold transition ${
            activeTab === tab.key
              ? 'border-blue-600 text-blue-800'
              : 'border-transparent text-gray-600 hover:text-blue-600'
          }`}
          onClick={() => onTabChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default TabbedSection;
