import { ReactNode, useState } from "react";

import { applyInOrder, cn, FunctionOrChain, identity } from "utils";

interface Tab {
  key: string;
  body: () => ReactNode;
}

export type Tabs = [Tab, ...Tab[]];

interface UseTabsProps {
  tabs: Tabs;
  defaultTab?: Tabs[number]["key"];
  renderHeader?: FunctionOrChain<string, ReactNode>;
}

const useTabs = ({
  tabs,
  defaultTab,
  renderHeader = identity,
}: UseTabsProps) => {
  const [selectedTab, setSelectedTab] = useState(defaultTab || tabs[0].key);

  const render = applyInOrder(renderHeader);

  return [
    <div className="Tabs">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={cn("tabButton", {
            selected: tab.key === selectedTab,
          })}
          onClick={() => setSelectedTab(tab.key)}
        >
          {render(tab.key)}
        </button>
      ))}
    </div>,
    tabs.find((tab) => tab.key === selectedTab)?.body(),
  ];
};

export default useTabs;
