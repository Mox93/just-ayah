import { isEqual } from "lodash";
import { forwardRef, ReactNode, Ref } from "react";

import { ButtonProps, DropdownButton } from "components/Buttons";
import Menu from "components/Menu";
import { OverflowDir, useDropdown } from "hooks";
import { GetKey } from "models";
import {
  applyInOrder,
  capitalize,
  cn,
  FunctionOrChain,
  identity,
  mergeRefs,
  omit,
} from "utils";

interface SelectionMenuProps<TOption> extends Omit<ButtonProps, "children"> {
  options: TOption[];
  selected?: TOption;
  renderElement?: FunctionOrChain<TOption, ReactNode>;
  overflowDir?: OverflowDir;
  placeholder?: string;
  noCheckmark?: boolean;
  getKey?: GetKey<TOption>;
  checkIsSelected?: (option: TOption, selected?: TOption) => boolean;
  setValue?: (option?: TOption) => void;
}

const SelectionMenu = <TOption,>(
  {
    className,
    dir,
    overflowDir,
    options,
    selected,
    variant = "plain-text",
    size = "medium",
    placeholder,
    keepFormat,
    noCheckmark,
    onClick,
    setValue = omit,
    getKey = identity,
    checkIsSelected = isEqual,
    renderElement = identity,
    ...props
  }: SelectionMenuProps<TOption>,
  ref: Ref<HTMLButtonElement>
) => {
  const { drivenRef, driverRef, isOpen, dropdownWrapper, dropdownAction } =
    useDropdown({
      className: cn("SelectionMenu", className),
      dir,
      overflowDir,
      driverAction: "toggle",
    });

  const render = applyInOrder(
    (element) => (keepFormat ? element : capitalize(element)),
    renderElement
  );

  return dropdownWrapper(
    <DropdownButton
      {...{ ...props, variant, size, keepFormat, isOpen, dir }}
      className={cn("driver", {
        empty: selected === undefined && placeholder === undefined,
      })}
      onClick={onClick}
      ref={mergeRefs(ref, driverRef)}
    >
      {selected ? render(selected) : placeholder || ". . ."}
    </DropdownButton>,
    () => (
      <Menu
        {...{ variant, size, getKey, dir }}
        ref={drivenRef}
        items={options}
        checkIsSelected={(item) => checkIsSelected(item, selected)}
        onSelect={(item) => {
          setValue(item);
          dropdownAction("close");
        }}
        renderElement={render}
        withCheckMark={!noCheckmark}
      />
    )
  );
};

export default forwardRef(SelectionMenu);
