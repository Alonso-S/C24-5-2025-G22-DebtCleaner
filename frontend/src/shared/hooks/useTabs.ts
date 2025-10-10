import { useState } from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export const useTabs = (initialTab: string) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  return {
    activeTab,
    setActiveTab: handleTabChange
  };
};

export default useTabs;