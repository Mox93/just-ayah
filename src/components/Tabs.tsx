import { FunctionComponent, ReactNode } from "react";
import { cn } from "../utils";

interface TabsProps {
  elements: { id: string; name: string }[];
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
    <div className="tabs">
      <div className="actions">{actions}</div>
      {elements.map((element) => (
        <button
          key={element.id}
          className={cn({ selected: selected === element.id }, "element")}
          onClick={() => onChange(element.id)}
        >
          <h4 className="title">{element.name}</h4>
        </button>
      ))}
    </div>
  );
};

export default Tabs;
