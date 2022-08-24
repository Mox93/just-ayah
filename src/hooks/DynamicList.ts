import { cloneDeep, uniqueId } from "lodash";
import { Reducer, useEffect, useReducer } from "react";

type Items<T> = { id: string; item: T | null }[];

interface OnChange<TItem> {
  onChange?: (items: TItem[]) => void;
}

interface UseDynamicListProps<TItem> extends OnChange<TItem> {
  items?: TItem[];
}

interface State<TItem> {
  items: Items<TItem>;
}

interface P1 {
  index: number;
}

interface P2<TIrem> extends P1 {
  data?: TIrem;
}

interface P3 {
  from: number;
  to: number;
}

type Action<TItem> =
  | (
      | {
          type: "remove" | "clone";
          payload: P1;
        }
      | { type: "add"; payload: P2<TItem> }
      | {
          type: "move" | "swap";
          payload: P3;
        }
      | { type: "update"; payload?: TItem[] }
    ) &
      OnChange<TItem>;

const emptyItems = () => [{ id: uniqueId(), item: null }];

const itemsInit = <TItem>(items?: TItem[]): State<TItem> => ({
  items:
    items?.map((item) => ({
      id: uniqueId(),
      item,
    })) || emptyItems(),
});

const reduce = <TItem>(
  { items }: State<TItem>,
  { type, payload, onChange }: Action<TItem>
): State<TItem> => {
  let newItems = [...items];

  switch (type) {
    case "add":
      const { data = null, index: idx } = payload as P2<TItem>;
      const next = idx + 1;
      newItems = [
        ...items.slice(0, next),
        { id: uniqueId(), item: data },
        ...items.slice(next),
      ];
      break;

    case "clone":
      const { index: i } = payload as P2<TItem>;
      const next1 = i + 1;
      newItems = [
        ...items.slice(0, next1),
        { id: uniqueId(), item: cloneDeep(newItems[i].item) },
        ...items.slice(next1),
      ];
      break;

    case "remove":
      const { index } = payload as P1;
      newItems = [...items.slice(0, index), ...items.slice(index + 1)];
      break;

    case "move":
      const { from, to } = payload as P3;
      const [target] = newItems.splice(from, 1);
      newItems.splice(to, 0, target);
      break;

    case "swap":
      const { from: idx1, to: idx2 } = payload as P3;
      const item1 = newItems[idx1];
      const item2 = newItems[idx2];
      newItems[idx1] = item2;
      newItems[idx2] = item1;
      break;

    case "update":
      return itemsInit(payload as TItem[]);
  }

  if (newItems.length === 0) {
    newItems = emptyItems();
  }

  if (onChange) {
    const _items: TItem[] = Array(newItems.length);

    newItems.forEach(({ item }, index) => {
      if (item) {
        _items[index] = item;
      }
    });

    onChange(_items);
  }

  return { items: newItems };
};

const useDynamicList = <TItem>({
  items,
  onChange,
}: UseDynamicListProps<TItem> = {}) => {
  const [{ items: newItems }, dispatch] = useReducer<
    Reducer<State<TItem>, Action<TItem>>,
    TItem[] | undefined
  >(reduce, items, itemsInit);

  useEffect(() => {
    dispatch({ type: "update", payload: items });
  }, [items]);

  const addItem = (index: number, data?: TItem) => {
    dispatch({ type: "add", payload: { index, data }, onChange });
  };
  const cloneItem = (index: number) => {
    dispatch({ type: "clone", payload: { index }, onChange });
  };
  const removeItem = (index: number) => {
    dispatch({ type: "remove", payload: { index }, onChange });
  };
  const moveItem = (from: number, to: number) => {
    dispatch({ type: "move", payload: { from, to }, onChange });
  };
  const swapItem = (from: number, to: number) => {
    dispatch({ type: "swap", payload: { from, to }, onChange });
  };

  return {
    items: newItems,
    addItem,
    cloneItem,
    removeItem,
    moveItem,
    swapItem,
  };
};

export default useDynamicList;
