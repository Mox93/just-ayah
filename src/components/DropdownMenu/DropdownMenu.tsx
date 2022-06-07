import { isEqual } from "lodash";
import { forwardRef, ReactNode, Ref } from "react";

import { Button, ButtonProps } from "components/Buttons";
import { DropdownArrow } from "components/Icons";
import Menu from "components/Menu";
import { OverflowDir, useDropdown } from "hooks";
import { GetKey } from "models";
import {
  applyInOrder,
  capitalize,
  cn,
  FunctionOrChain,
  identity,
  mergeCallbacks,
  mergeRefs,
  omit,
} from "utils";

interface DropdownMenuProps<TOption> extends Omit<ButtonProps, "children"> {
  options: TOption[];
  selected?: TOption;
  renderElement?: FunctionOrChain<TOption, ReactNode>;
  overflowDir?: OverflowDir;
  placeholder?: string;
  getKey?: GetKey<TOption>;
  checkIsSelected?: (option: TOption, selected?: TOption) => boolean;
  setValue?: (option?: TOption) => void;
}

const DropdownMenu = <TOption,>(
  {
    className,
    dir,
    overflowDir,
    options,
    selected,
    variant = "plain-text",
    placeholder = ". . .",
    keepFormat,
    onClick,
    setValue = omit,
    getKey = identity,
    checkIsSelected = isEqual,
    renderElement = identity,
    ...props
  }: DropdownMenuProps<TOption>,
  ref: Ref<HTMLButtonElement>
) => {
  const { drivenRef, driverRef, isOpen, dropdownWrapper, dropdownAction } =
    useDropdown({ className: cn("DropdownMenu", className), dir, overflowDir });

  const render = applyInOrder(
    (element) => (keepFormat ? element : capitalize(element)),
    renderElement
  );

  return dropdownWrapper(
    <Button
      {...{ ...props, variant, keepFormat }}
      className={cn("driver", { empty: selected === undefined })}
      onClick={mergeCallbacks(onClick, () => dropdownAction("toggle"))}
      ref={mergeRefs(ref, driverRef)}
    >
      {selected ? render(selected) : placeholder}
      <DropdownArrow isOpen={isOpen} />
    </Button>,
    () => (
      <Menu
        ref={drivenRef}
        items={options}
        getKey={getKey}
        checkIsSelected={(item) => checkIsSelected(item, selected)}
        onSelect={(item) => {
          setValue(item);
          dropdownAction("close");
        }}
        renderElement={(item) => render(item)}
      />
    )
  );
};

export default forwardRef(DropdownMenu);
