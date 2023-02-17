import { forwardRef, ReactNode, Ref } from "react";

import { Button, SizeVariant, ButtonVariant } from "components/Buttons";
import Container from "components/Container";
import { CheckMark } from "components/Icons";
import { Converter, GetKey, Path } from "models";
import { applyInOrder, cn, FunctionOrChain, identity, pass } from "utils";

import { useListFilter } from "./Menu.utils";

interface MenuProps<TOption> {
  options: TOption[];
  header?: ReactNode;
  className?: string;
  dir?: string;
  withCheckMark?: boolean;
  renderElement?: FunctionOrChain<TOption, ReactNode>;
  variant?: ButtonVariant | null;
  size?: SizeVariant | null;
  searchFields?: Path<TOption>[];
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
        <>
          {header}
          {searchBar}
        </>
      }
      className={cn("Menu", className)}
    >
      {optionList.map((option) => {
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
            {withCheckMark && isSelected && <CheckMark dir={dir} />}
          </Button>
        );
      })}
    </Container>
  );
});
