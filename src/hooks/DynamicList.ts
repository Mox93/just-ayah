import { cloneDeep, uniqueId } from "lodash";
import { Reducer, useEffect, useMemo, useReducer } from "react";
import { oneOf } from "utils";

type Items<T> = { id: string; item: T | undefined }[];

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

const emptyItems = () => [{ id: uniqueId(), item: undefined }];

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
  const newItems = [...items];
  const index = oneOf(type, ["add", "clone"]) ? (payload as P1).index : -1;
  const next = index + 1;

  switch (type) {
    case "add":
      const { data } = payload as P2<TItem>;
      newItems.splice(next, 0, { id: uniqueId(), item: data });
      break;

    case "clone":
      newItems.splice(next, 0, {
        id: uniqueId(),
        item: cloneDeep(newItems[index].item),
      });
      break;

    case "remove":
      newItems.splice(index, 1);
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
    newItems.push(...emptyItems());
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

  const actions = useMemo(
    () => ({
      addItem: (index: number, data?: TItem) => {
        dispatch({ type: "add", payload: { index, data }, onChange });
      },
      cloneItem: (index: number) => {
        dispatch({ type: "clone", payload: { index }, onChange });
      },
      removeItem: (index: number) => {
        dispatch({ type: "remove", payload: { index }, onChange });
      },
      moveItem: (from: number, to: number) => {
        dispatch({ type: "move", payload: { from, to }, onChange });
      },
      swapItem: (from: number, to: number) => {
        dispatch({ type: "swap", payload: { from, to }, onChange });
      },
    }),
    [onChange]
  );

  return { items: newItems, ...actions };
};

export default useDynamicList;
