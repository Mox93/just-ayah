import { ReactElement, ReactNode, useState, useTransition } from "react";

import { applyInOrder, cn, FunctionOrChain, identity } from "utils";

interface Tab {
  key: string;
  body: ReactElement;
}

export type Tabs = [Tab, Tab, ...Tab[]];

interface UseTabsProps {
  tabs: Tabs;
  defaultTab?: Tab["key"];
  renderHeader?: FunctionOrChain<string, ReactNode>;
}

export default function useTabs({
  tabs,
  defaultTab,
  renderHeader = identity,
}: UseTabsProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedTab, setSelectedTab] = useState(defaultTab || tabs[0].key);
  const [nextTab, setNextTab] = useState<string>();

  const render = applyInOrder(renderHeader);

  return [
    <div className="Tabs">
      {tabs.map(({ key }) => (
        <button
          key={key}
          className={cn("tabButton", {
            selected: key === selectedTab,
            next: key === nextTab && isPending,
          })}
          onClick={() => {
            setNextTab(key);
            startTransition(() => {
              setSelectedTab(key);
              setNextTab(undefined);
            });
          }}
        >
          {render(key)}
        </button>
      ))}
    </div>,
    tabs.find(({ key }) => key === selectedTab)?.body,
  ];
}
