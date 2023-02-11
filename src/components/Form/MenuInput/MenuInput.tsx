import { isEqual } from "lodash";
import {
  ChangeEventHandler,
  forwardRef,
  ReactNode,
  Ref,
  useEffect,
  useMemo,
  useState,
} from "react";

import { ReactComponent as SearchIcon } from "assets/icons/search-svgrepo-com.svg";
import { DropdownArrow } from "components/Icons";
import Menu from "components/Menu";
import { OverflowDir, useDropdown } from "hooks";
import { GetKey, Merge, Path } from "models";
import {
  applyInOrder,
  cn,
  FunctionOrChain,
  hasAtLeastOne,
  identity,
  oneOf,
} from "utils";
import { after, before } from "utils/position";
import { substringMatch } from "utils/match";

import Input, { InputProps } from "../Input";

export type MenuInputProps<TOption> = Merge<
  InputProps,
  {
    overflowDir?: OverflowDir;
    setValue?: (option?: TOption) => void;
  }
>;

interface MenuInputPropsInternal<TOption> extends MenuInputProps<TOption> {
  options: TOption[];
  selected?: TOption;
  renderElement?: FunctionOrChain<TOption, ReactNode>;
  searchFields?: Path<TOption>[];
  getKey?: GetKey<TOption>;
}

/**
// TODO:
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
    searchFields,
    getKey = identity,
    setValue,
    renderElement = identity,
    ...props
  }: MenuInputPropsInternal<TOption>,
  ref: Ref<HTMLInputElement>
) => {
  const [optionList, setOptionList] = useState(options);
  const { drivenRef, driverRef, isOpen, dropdownWrapper, dropdownAction } =
    useDropdown({
      className: cn("MenuInput", className),
      dir,
      overflowDir,
      onClick: "toggle",
    });

  const isSelected = !oneOf(selected, ["", null, undefined]);

  const applyFilter = useMemo<ChangeEventHandler<HTMLInputElement> | undefined>(
    () =>
      hasAtLeastOne(searchFields)
        ? (e) => {
            const results = substringMatch(options, {
              filter: { type: "pick", fields: searchFields },
            })(e.target.value);

            setOptionList(
              results?.length ? results.map(({ value }) => value) : options
            );
          }
        : undefined,

    [searchFields, options]
  );

  useEffect(() => {
    // reset options on close so the next time we don't get the previous search result
    isOpen || setOptionList(options);
  }, [isOpen, options]);

  return dropdownWrapper(
    // TODO replace with Button
    <Input
      {...{ ...props, dir, ref }}
      className={cn({ hidden: isSelected })} // TODO once filtering is implemented replace condition with `!isOpen && selected`
      readOnly // TODO remove once filtering is implemented
      fieldRef={driverRef}
    >
      {isSelected // TODO once filtering is implemented replace condition with `!isOpen && selected`
        ? before(
            "input",
            <div className="selected">
              {applyInOrder(renderElement, selected!)}
            </div>
          )
        : null}
      {after("input", <DropdownArrow {...{ isOpen, dir }} />)}
    </Input>,
    () => (
      <Menu
        {...{ dir, getKey }}
        ref={drivenRef}
        items={optionList}
        checkIsSelected={(item) => isEqual(item, selected)}
        renderElement={renderElement}
        onSelect={(item) => {
          setValue?.(item);
          dropdownAction("close");
        }}
        {...(searchFields && {
          header: (
            <Input
              dir={dir}
              className="searchField"
              onChange={applyFilter}
              autoComplete="off"
              autoFocus
              visibleBorder
            >
              {before("input", <SearchIcon className="icon" />)}
            </Input>
          ),
        })}
        withCheckMark
      />
    )
  );
};

export default forwardRef(MenuInput);
