import { forwardRef, ReactNode, Ref } from "react";

import Card from "components/Card";
import DropdownArrow from "components/DropdownArrow";
import { OverflowDir, useDirT, useDropdown } from "hooks";
import { Merge } from "models";
import { applyInOrder, cn, FunctionOrChain, identity, omit } from "utils";
import { after, before } from "utils/position";

import Input, { InputProps } from "../Input";

export type MenuInputProps<TOption> = Merge<
  InputProps,
  {
    overflowDir?: OverflowDir;
    setValue?: (option?: TOption) => void;
  }
>;

interface InternalMenuInputProps<TOption> extends MenuInputProps<TOption> {
  options: TOption[];
  selected?: TOption;
  renderElement?: FunctionOrChain<TOption, ReactNode>;
  getKey?: (option: TOption) => string | number;
}

/**
 * TODO:
 *  - Implement filtering
 *  - Handle reset selection
 */

const MenuInput = <TOption,>(
  {
    className,
    options,
    dir,
    overflowDir,
    selected,
    getKey = identity,
    setValue = omit,
    renderElement = identity,
    ...props
  }: InternalMenuInputProps<TOption>,
  ref: Ref<HTMLInputElement>
) => {
  const dirT = useDirT();
  const { drivenRef, driverRef, isOpen, dropdownWrapper, dropdownAction } =
    useDropdown({
      className: cn("MenuInput", className),
      dir,
      overflowDir,
    });

  // TODO add a second input field for searching and use autoFocus

  return dropdownWrapper(
    <Input
      {...props}
      className={cn({ hidden: selected })} // TODO once filtering is implemented replace condition with `!isOpen && selected`
      dir={dir || dirT}
      readOnly // TODO remove once filtering is implemented
      ref={ref}
      labelRef={driverRef}
      onClick={() => dropdownAction("open")}
    >
      {selected // TODO once filtering is implemented replace condition with `!isOpen && selected`
        ? before(
            "input",
            <div className="selected">
              {applyInOrder(renderElement)(selected)}
            </div>
          )
        : null}
      {after("input", <DropdownArrow isOpen={isOpen} />)}
    </Input>,
    <Card variant="menu">
      {isOpen && ( // TODO generalize this optimization
        <ul ref={drivenRef} className="list" dir={dir || dirT}>
          {options.map((option) => (
            // TODO convert to radio input
            <li
              className="element"
              key={getKey(option)}
              onClick={() => {
                setValue(option);
                dropdownAction("close");
              }}
            >
              {applyInOrder(renderElement)(option)}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};

export default forwardRef(MenuInput);
