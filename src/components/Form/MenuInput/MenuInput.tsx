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
import { GetKey, Merge } from "models";
import { applyInOrder, cn, FunctionOrChain, identity } from "utils";
import { after, before } from "utils/position";
import { substringMatch } from "utils/match";

import Input, { InputProps } from "../Input";
import { FieldPath } from "react-hook-form";

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
  searchFields?: FieldPath<TOption>[];
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

  const isSelected = !["", null, undefined].includes(selected as any);

  const applyFilter: ChangeEventHandler<HTMLInputElement> | undefined = useMemo(
    () =>
      searchFields &&
      ((e) => {
        const results = substringMatch(options, {
          filter: ["take", searchFields],
        })(e.target.value);

        setOptionList(() =>
          results?.length ? results.map(({ value }) => value) : options
        );
      }),
    [searchFields, options]
  );

  useEffect(() => {
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
              {applyInOrder(renderElement)(selected!)}
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
