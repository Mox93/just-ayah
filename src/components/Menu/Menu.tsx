import { forwardRef, ReactNode, Ref } from "react";

import { Button, ButtonSize, ButtonVariant } from "components/Buttons";
import Container from "components/Container";
import { CheckMark } from "components/Icons";
import { Converter, GetKey } from "models";
import { applyInOrder, cn, FunctionOrChain, identity, pass } from "utils";

interface MenuProps<TItem> {
  items: TItem[];
  header?: ReactNode;
  className?: string;
  dir?: string;
  withCheckMark?: boolean;
  renderElement?: FunctionOrChain<TItem, ReactNode>;
  variant?: ButtonVariant | null;
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
    withCheckMark,
    checkIsSelected = pass(false),
    renderElement = identity,
    getKey = identity,
    onSelect,
  }: MenuProps<TItem>,
  ref: Ref<HTMLDivElement>
) => {
  const render = applyInOrder(renderElement);

  return (
    <Container
      variant="menu"
      {...{ dir, header, ref }}
      className={cn("Menu", className)}
    >
      {items.map((item) => {
        const isSelected = checkIsSelected(item);

        return (
          <Button
            key={getKey(item)}
            className={cn("item", {
              withCheckMark,
              selected: isSelected,
            })}
            onClick={pass(onSelect, item)}
            {...{ variant, size, dir }}
          >
            {render(item)}
            {withCheckMark && isSelected && <CheckMark dir={dir} />}
          </Button>
        );
      })}
    </Container>
  );
};

export default forwardRef(Menu);
