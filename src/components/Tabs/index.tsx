import { FunctionComponent, ReactNode } from "react";

import { cn } from "utils";

import "./style.scss";

interface TabsProps {
  elements: { id: string; name: string; value: string }[];
  selected: string;
  onChange: (selection: string) => void;
  actions?: ReactNode;
}

const Tabs: FunctionComponent<TabsProps> = ({
  elements,
  selected,
  onChange,
  actions,
}) => {
  return (
    <div className="Tabs">
      <div className="actions">{actions}</div>
      {elements.map((element) => (
        <button
          key={element.id}
          className={cn({ selected: selected === element.id }, "element")}
          onClick={() => onChange(element.id)}
        >
          <h4 className="title">{element.value}</h4>
        </button>
      ))}
    </div>
  );
};

export default Tabs;
