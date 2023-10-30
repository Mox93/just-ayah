import { isEqual } from "lodash";
import { forwardRef, Ref } from "react";

import { SpinningArrow } from "components/Icons";
import Menu, { MenuProps } from "components/Menu";
import { AnchorPoint, useDropdown } from "hooks";
import { applyInOrder, cn, identity, oneOf } from "utils";
import { after, before } from "utils/position";

import Input, { InputProps } from "../Input";

export type MenuInputProps<TOption> = InputProps & {
  anchorPoint?: AnchorPoint;
  setValue?: (option?: TOption) => void;
};

type MenuInputPropsInternal<TOption> = MenuInputProps<TOption> &
  Pick<
    MenuProps<TOption>,
    "options" | "searchFields" | "header" | "renderElement" | "getKey"
  > &
  (
    | {
        multiChoice?: false;
        selected?: TOption;
        setValue?: (option?: TOption) => void;
      }
    | {
        multiChoice: true;
        selected?: TOption[];
        setValue?: (option?: TOption[]) => void;
      }
  );

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
    disabled,
    multiChoice,
    header,
    ...props
  }: MenuInputPropsInternal<TOption>,
  ref: Ref<HTMLInputElement>
) {
  const { drivenRef, driverRef, isOpen, dropdownWrapper, close } = useDropdown<
    HTMLDivElement,
    HTMLDivElement
  >({
    className: cn("MenuInput", className, { multiChoice }),
    dir,
    anchorPoint,
    onClick: !disabled ? "toggle" : undefined,
  });

  const hasSelection = Array.isArray(selected)
    ? !!selected.length
    : !oneOf(selected, ["", null, undefined]);

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
              {multiChoice
                ? selected!.map((s) => (
                    <div className="option" key={getKey(s)}>
                      {applyInOrder(renderElement, s)}
                    </div>
                  ))
                : applyInOrder(renderElement, selected!)}
            </div>
          )
        : null}
      {after("input", <SpinningArrow {...{ isOpen, dir }} />)}
    </Input>,
    <Menu
      {...{ dir, getKey, options, searchFields, header }}
      ref={drivenRef}
      checkIsSelected={
        hasSelection
          ? (option) =>
              multiChoice
                ? selected!.some((s) => isEqual(option, s))
                : isEqual(option, selected)
          : undefined
      }
      renderElement={renderElement}
      onSelect={(option) => {
        if (multiChoice) {
          const _selected = [...(selected || [])];
          let index = -1;

          for (let i = 0; i < _selected.length; i++) {
            if (isEqual(option, _selected[i])) {
              index = i;
              break;
            }
          }

          if (index > -1) _selected.splice(index, 1);
          else _selected.push(option);

          setValue?.(_selected);
        } else {
          setValue?.(option);
          close();
        }
      }}
      withCheckMark
    />
  );
});
