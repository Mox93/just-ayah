import { forwardRef, ReactNode, Ref } from "react";

import Card from "components/Card";
import DropdownArrow from "components/DropdownArrow";
import { Merge } from "models";
import {
  applyInOrder,
  cn,
  FunctionOrChain,
  identity,
  omit,
  OverflowDir,
} from "utils";
import { useDropdown } from "utils/dropdown";
import { after, before } from "utils/position";
import { useDirT } from "utils/translation";

import Input, { InputProps } from "../Input";

export type AutoCompleatInputProps<TOption> = Merge<
  InputProps,
  {
    overflowDir?: OverflowDir;
    setValue?: (option?: TOption) => void;
  }
>;

interface InternalAutoCompleatInputProps<TOption>
  extends AutoCompleatInputProps<TOption> {
  options: TOption[];
  selected?: ReactNode;
  renderElement?: FunctionOrChain<TOption, ReactNode>;
  getKey?: (option: TOption) => string | number;
}

/**
 * TODO:
 *  - Implement filtering
 *  - Handle reset selection
 */

const AutoCompleatInput = <TOption,>(
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
  }: InternalAutoCompleatInputProps<TOption>,
  ref: Ref<HTMLInputElement>
) => {
  const dirT = useDirT();
  const { drivenRef, driverRef, isOpen, dropdownWrapper, dropdownAction } =
    useDropdown({
      className: cn("AutoCompleatInput", className),
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
        ? before("input", <div className="selected">{selected}</div>)
        : null}
      {after("input", <DropdownArrow isOpen={isOpen} />)}
    </Input>,
    <Card variant="menu">
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
    </Card>
  );
};

export default forwardRef(AutoCompleatInput);
