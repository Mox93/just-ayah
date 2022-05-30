import { isEqual } from "lodash";
import { forwardRef, ReactNode, Ref } from "react";

import { Button, ButtonProps } from "components/Buttons";
import Container from "components/Container";
import { CheckMark, DropdownArrow } from "components/Icons";
import { OverflowDir, useDropdown } from "hooks";
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

interface RenderElementProps<TOption> {
  element: TOption;
  isSelected?: boolean;
}

interface DropdownMenuProps<TOption> extends Omit<ButtonProps, "children"> {
  options: TOption[];
  selected?: TOption;
  renderElement?: FunctionOrChain<RenderElementProps<TOption>, ReactNode>;
  overflowDir?: OverflowDir;
  compact?: boolean;
  placeholder?: string;
  getKey?: (option: TOption) => string | number;
  checkIsSelected?: (option: TOption, selected?: TOption) => boolean;
  setValue?: (option?: TOption) => void;
}

const DropdownMenu = <TOption,>(
  {
    compact,
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
    renderElement = ({ element: option }) => option,
    ...props
  }: DropdownMenuProps<TOption>,
  ref: Ref<HTMLButtonElement>
) => {
  const { drivenRef, driverRef, isOpen, dropdownWrapper, dropdownAction } =
    useDropdown({ className: cn("DropdownMenu", className), dir, overflowDir });

  const render = applyInOrder(
    ({ element, ...rest }) => ({
      element: keepFormat ? element : capitalize(element),
      ...rest,
    }),
    renderElement
  );

  const label = selected ? render({ element: selected }) : placeholder;

  return dropdownWrapper(
    <Button
      {...{ ...props, variant, keepFormat }}
      className={cn("driver", { empty: selected === undefined })}
      onClick={mergeCallbacks(onClick, () => dropdownAction("toggle"))}
      ref={mergeRefs(ref, driverRef)}
    >
      {label}
      <DropdownArrow isOpen={isOpen} />
    </Button>,
    <Container
      variant="menu"
      className={cn({ compact }, "driven")}
      ref={drivenRef}
    >
      {isOpen &&
        options.map((option) => {
          const isSelected = checkIsSelected(option, selected);

          return (
            <Button
              {...{ ...props, variant }}
              key={getKey(option)}
              className="option"
              onClick={() => {
                setValue(option);
                dropdownAction("close");
              }}
            >
              {render({ element: option, isSelected })}
              {isSelected && <CheckMark />}
            </Button>
          );
        })}
    </Container>
  );
};

export default forwardRef(DropdownMenu);
