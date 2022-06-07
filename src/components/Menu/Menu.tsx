import { forwardRef, ReactNode, Ref } from "react";

import { Button, ButtonSize } from "components/Buttons";
import Container from "components/Container";
import { CheckMark } from "components/Icons";
import { applyInOrder, cn, FunctionOrChain, identity, pass } from "utils";
import { Converter, GetKey } from "models";

interface MenuProps<TItem> {
  items: TItem[];
  header?: ReactNode;
  className?: string;
  dir?: string;
  noCheckMark?: boolean;
  renderElement?: FunctionOrChain<TItem, ReactNode>;
  variant?: string | null;
  size?: ButtonSize | null;
  checkIsSelected?: Converter<TItem, boolean>;
  getKey?: GetKey<TItem>;
  onSelect?: (item: TItem) => void;
}

const Menu = <TItem,>(
  {
    items,
    className,
    dir,
    header,
    variant = "plain-text",
    size = "small",
    noCheckMark,
    checkIsSelected = pass(false),
    renderElement = identity,
    getKey = identity,
    onSelect,
  }: MenuProps<TItem>,
  ref: Ref<HTMLDivElement>
) => {
  const render = applyInOrder(renderElement);

  return (
    <div className={cn("Menu", className)} {...{ ref, dir }}>
      <Container variant="menu" {...{ dir, header }}>
        {items.map((item) => {
          const isSelected = checkIsSelected(item);

          return (
            <Button
              key={getKey(item)}
              variant={variant as any}
              className={cn("item", {
                withCheckMark: !noCheckMark,
                selected: isSelected,
              })}
              onClick={pass(onSelect, item)}
              {...{ size, dir }}
            >
              {render(item)}
              {!noCheckMark && isSelected && <CheckMark dir={dir} />}
            </Button>
          );
        })}
      </Container>
    </div>
  );
};

export default forwardRef(Menu);
