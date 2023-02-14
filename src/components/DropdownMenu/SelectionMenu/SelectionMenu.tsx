import { isEqual } from "lodash";
import { forwardRef, ReactNode, Ref } from "react";

import { Button, ButtonProps, DropdownButton } from "components/Buttons";
import Menu from "components/Menu";
import { OverflowDir, useDropdown } from "hooks";
import { GetKey, Path } from "models";
import {
  applyInOrder,
  capitalize,
  cn,
  FunctionOrChain,
  identity,
  mergeRefs,
} from "utils";

interface SelectionMenuProps<TOption> extends Omit<ButtonProps, "children"> {
  options: TOption[];
  selected?: TOption;
  renderElement?: FunctionOrChain<TOption, ReactNode>;
  overflowDir?: OverflowDir;
  placeholder?: string;
  noCheckmark?: boolean;
  noArrow?: boolean;
  searchFields?: Path<TOption>[];
  getKey?: GetKey<TOption>;
  checkIsSelected?: (option: TOption, selected?: TOption) => boolean;
  setValue?: (option: TOption) => void;
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
    noArrow,
    searchFields,
    onClick,
    setValue,
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
      onClick: "toggle",
    });

  const render = applyInOrder([
    (element) => (keepFormat ? element : capitalize(element)),
    renderElement,
  ]);

  const ButtonComponent = noArrow ? Button : DropdownButton;

  return dropdownWrapper(
    <ButtonComponent
      {...{
        ...props,
        variant,
        size,
        keepFormat,
        dir,
        ...(noArrow ? {} : { isOpen }),
      }}
      className={cn("driver", {
        empty: selected === undefined && placeholder === undefined,
      })}
      onClick={onClick}
      ref={mergeRefs(ref, driverRef)}
    >
      {selected ? render(selected) : placeholder || ". . ."}
    </ButtonComponent>,
    () => (
      <Menu
        {...{ variant, size, getKey, dir, searchFields, options }}
        ref={drivenRef}
        checkIsSelected={(option) => checkIsSelected(option, selected)}
        onSelect={(option) => {
          setValue?.(option);
          dropdownAction("close");
        }}
        renderElement={render}
        withCheckMark={!noCheckmark}
      />
    )
  );
};

export default forwardRef(SelectionMenu);
