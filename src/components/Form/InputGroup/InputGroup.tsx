import { ReactNode } from "react";

import { ReactComponent as CrossIcon } from "assets/icons/close-svgrepo-com.svg";
import { ReactComponent as PlusIcon } from "assets/icons/plus-svgrepo-com.svg";
import { Button } from "components/Buttons";
import { SelectionMenu } from "components/DropdownMenu";
import { ThisOrNothing } from "models";
import { cn, range } from "utils";

interface MoveListItemProps {
  moveItem: (to: number) => void;
  index: number;
  size: number;
}

type DynamicListItemProps = {
  variant: "dynamicListItem";
  addItem: VoidFunction;
  removeItem: VoidFunction;
} & ThisOrNothing<MoveListItemProps>;

type InputGroupProps = {
  children: ReactNode;
  className?: string;
} & ThisOrNothing<DynamicListItemProps>;

export default function InputGroup({
  className,
  children,
  variant,
  addItem,
  removeItem,
  moveItem,
  index,
  size,
}: InputGroupProps) {
  return (
    <div className={cn("InputGroup", className, variant)}>
      {size && (
        <SelectionMenu
          options={range(1, size + 1)}
          selected={index + 1}
          className="position"
          noArrow
          onOptionChange={(to) => moveItem(to - 1)}
        />
      )}
      {children}
      {variant === "dynamicListItem" && (
        <div className="actions">
          <Button
            iconButton
            variant="primary-ghost"
            className="action"
            onClick={addItem}
          >
            <PlusIcon className="icon" />
          </Button>
          <Button
            iconButton
            variant="danger-ghost"
            className="action"
            onClick={removeItem}
          >
            <CrossIcon className="icon" />
          </Button>
        </div>
      )}
    </div>
  );
}
