import { isEqual } from "lodash";
import { forwardRef, ReactNode, Ref } from "react";

import { DropdownArrow } from "components/Icons";
import Menu from "components/Menu";
import { OverflowDir, useDropdown } from "hooks";
import { GetKey, Merge } from "models";
import { applyInOrder, cn, FunctionOrChain, identity, omit } from "utils";
import { after, before } from "utils/position";

import Input, { InputProps } from "../Input";
import SearchBar from "components/SearchBar";

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
  searchable?: boolean;
  renderElement?: FunctionOrChain<TOption, ReactNode>;
  getKey?: GetKey<TOption>;
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
    searchable,
    getKey = identity,
    setValue = omit,
    renderElement = identity,
    ...props
  }: InternalMenuInputProps<TOption>,
  ref: Ref<HTMLInputElement>
) => {
  const { drivenRef, driverRef, isOpen, dropdownWrapper, dropdownAction } =
    useDropdown({
      className: cn("MenuInput", className),
      dir,
      overflowDir,
      driverAction: "open",
    });

  return dropdownWrapper(
    // TODO replace with Button
    <Input
      {...{ ...props, dir, ref }}
      className={cn({ hidden: selected })} // TODO once filtering is implemented replace condition with `!isOpen && selected`
      readOnly // TODO remove once filtering is implemented
      labelRef={driverRef}
    >
      {selected // TODO once filtering is implemented replace condition with `!isOpen && selected`
        ? before(
            "input",
            <div className="selected">
              {applyInOrder(renderElement)(selected)}
            </div>
          )
        : null}
      {after("input", <DropdownArrow {...{ isOpen, dir }} />)}
    </Input>,
    () => (
      <Menu
        {...{ dir, getKey }}
        ref={drivenRef}
        items={options}
        checkIsSelected={(item) => isEqual(item, selected)}
        renderElement={renderElement}
        onSelect={(item) => {
          setValue(item);
          dropdownAction("close");
        }}
        {...(searchable && { header: <SearchBar /> })} // TODO add props
        withCheckMark
      />
    )
  );
};

export default forwardRef(MenuInput);
