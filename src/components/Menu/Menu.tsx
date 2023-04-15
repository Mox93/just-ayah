import { forwardRef, ReactNode, Ref } from "react";

import { ReactComponent as CheckMarkIcon } from "assets/icons/checkmark-svgrepo-com.svg";
import { Button, ButtonProps } from "components/Buttons";
import Container from "components/Container";
import { LoadingDots } from "components/Icons";
import { Converter, GetKey } from "models";
import { applyInOrder, cn, FunctionOrChain, identity, pass } from "utils";

import { useListFilter, UseListFilterProps } from "./Menu.utils";

export interface MenuProps<TOption>
  extends UseListFilterProps<TOption>,
    Pick<ButtonProps, "variant" | "size" | "isLoading"> {
  header?: ReactNode;
  className?: string;
  withCheckMark?: boolean;
  renderElement?: FunctionOrChain<TOption, ReactNode>;
  checkIsSelected?: Converter<TOption, boolean>;
  getKey?: GetKey<TOption>;
  onSelect?: (item: TOption) => void;
}

export default forwardRef(function Menu<TItem>(
  {
    options,
    className,
    dir,
    header,
    variant = "plain-text",
    size = "small",
    withCheckMark,
    searchFields,
    renderElement = identity,
    isLoading,
    checkIsSelected = pass(false),
    getKey = identity,
    onSelect,
  }: MenuProps<TItem>,
  ref: Ref<HTMLDivElement>
) {
  const [optionList, searchBar] = useListFilter({ options, searchFields, dir });

  const render = applyInOrder(renderElement);

  return (
    <Container
      variant="menu"
      {...{ dir, ref }}
      header={
        (header || searchBar) && (
          <>
            {header}
            {searchBar}
          </>
        )
      }
      className={cn("Menu", className)}
    >
      {isLoading ? (
        <LoadingDots />
      ) : (
        optionList.map((option) => {
          const isSelected = checkIsSelected(option);

          return (
            <Button
              key={getKey(option)}
              className={cn("item", {
                withCheckMark,
                selected: isSelected,
              })}
              onClick={pass(onSelect, option)}
              {...{ variant, size, dir }}
            >
              {render(option)}
              {withCheckMark && isSelected && (
                <CheckMarkIcon className="CheckMark icon" {...{ dir }} /> // HACK spreading the { dir } like that prevents TS from complaining
              )}
            </Button>
          );
        })
      )}
    </Container>
  );
});
