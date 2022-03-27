import { FunctionComponent, ReactNode } from "react";
import { cn } from "utils";

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
      {elements.map(({ id, value }) => (
        <button
          key={id}
          className={cn({ selected: selected === id }, "element")}
          onClick={() => onChange(id)}
        >
          <h4 className="title">{value}</h4>
        </button>
      ))}
    </div>
  );
};

export default Tabs;
