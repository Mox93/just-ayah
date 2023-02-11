import { cloneDeep, uniqueId } from "lodash";
import { Reducer, useEffect, useReducer } from "react";

type Items<T> = { id: string; item: T | undefined }[];

interface Dependencies<TItem> {
  onChange?: (items: TItem[]) => void;
}

interface UseDynamicListProps<TItem> extends Dependencies<TItem> {
  items?: TItem[];
}

interface State<TItem> {
  items: Items<TItem>;
}

type Action<TItem> = (
  | {
      type: "remove" | "clone";
      payload: { index: number };
    }
  | {
      type: "add";
      payload: {
        index: number;
        data?: TItem;
      };
    }
  | {
      type: "move" | "swap";
      payload: {
        from: number;
        to: number;
      };
    }
  | { type: "update"; payload?: TItem[] }
) &
  Dependencies<TItem>;

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
  { onChange, ...action }: Action<TItem>
): State<TItem> => {
  const newItems = [...items];

  switch (action.type) {
    case "update": {
      const { payload } = action;

      return itemsInit(payload);
    }

    case "add": {
      const index = action.payload.index;
      const next = index + 1;
      const {
        payload: { data },
      } = action;

      newItems.splice(next, 0, { id: uniqueId(), item: data });
      break;
    }

    case "clone": {
      const index = action.payload.index;
      const next = index + 1;

      newItems.splice(next, 0, {
        id: uniqueId(),
        item: cloneDeep(newItems[index].item),
      });
      break;
    }

    case "remove": {
      const index = action.payload.index;
      newItems.splice(index, 1);
      break;
    }

    case "move": {
      const {
        payload: { from, to },
      } = action;
      const [target] = newItems.splice(from, 1);

      newItems.splice(to, 0, target);
      break;
    }

    case "swap": {
      const {
        payload: { from, to },
      } = action;
      const item1 = newItems[from];
      const item2 = newItems[to];

      newItems[from] = item2;
      newItems[to] = item1;
      break;
    }
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

export default function useDynamicList<TItem>({
  items,
  onChange,
}: UseDynamicListProps<TItem> = {}) {
  const [{ items: newItems }, dispatch] = useReducer<
    Reducer<State<TItem>, Action<TItem>>,
    TItem[] | undefined
  >(reduce, items, itemsInit);

  useEffect(() => {
    dispatch({ type: "update", payload: items });
  }, [items]);

  return {
    items: newItems,
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
  };
}
