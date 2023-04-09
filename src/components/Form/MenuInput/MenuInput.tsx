import { isEqual } from "lodash";
import { forwardRef, ReactNode, Ref } from "react";

import { SpinningArrow } from "components/Icons";
import Menu from "components/Menu";
import { AnchorPoint, useDropdown } from "hooks";
import { GetKey, Merge, Path } from "models";
import { applyInOrder, cn, FunctionOrChain, identity, oneOf } from "utils";
import { after, before } from "utils/position";

import Input, { InputProps } from "../Input";

export type MenuInputProps<TOption> = Merge<
  InputProps,
  {
    anchorPoint?: AnchorPoint;
    setValue?: (option?: TOption) => void;
  }
>;

interface MenuInputPropsInternal<TOption> extends MenuInputProps<TOption> {
  options: TOption[] | (() => TOption[]);
  selected?: TOption;
  renderElement?: FunctionOrChain<TOption, ReactNode>;
  searchFields?: Path<TOption>[];
  getKey?: GetKey<TOption>;
}

export default forwardRef(function MenuInput<TOption>(
  {
    className,
    options,
    dir,
    anchorPoint,
    selected,
    searchFields,
    getKey = identity,
    setValue,
    renderElement = identity,
    ...props
  }: MenuInputPropsInternal<TOption>,
  ref: Ref<HTMLInputElement>
) {
  const { drivenRef, driverRef, isOpen, dropdownWrapper, close } = useDropdown<
    HTMLDivElement,
    HTMLDivElement
  >({
    className: cn("MenuInput", className),
    dir,
    anchorPoint,
    onClick: "toggle",
  });

  const hasSelection = !oneOf(selected, ["", null, undefined]);

  return dropdownWrapper(
    // TODO replace with Button
    <Input
      {...{ ...props, dir, ref }}
      className={cn({ hidden: hasSelection })} // TODO once filtering is implemented replace condition with `!isOpen && selected`
      readOnly // TODO remove once filtering is implemented
      fieldRef={driverRef}
    >
      {hasSelection // TODO once filtering is implemented replace condition with `!isOpen && selected`
        ? before(
            "input",
            <div className="selected">
              {applyInOrder(renderElement, selected!)}
            </div>
          )
        : null}
      {after("input", <SpinningArrow {...{ isOpen, dir }} />)}
    </Input>,
    <Menu
      {...{ dir, getKey, options, searchFields }}
      ref={drivenRef}
      checkIsSelected={(option) => isEqual(option, selected)}
      renderElement={renderElement}
      onSelect={(option) => {
        setValue?.(option);
        close();
      }}
      withCheckMark
    />
  );
});
