import { cloneDeep, uniqueId } from "lodash";
import { useRef, useState } from "react";

import useUpdate from "./Update";

type Item<T> = { id: string; item: T | undefined };

type UpdateCallback<T> = (items: (T | undefined)[]) => void;

function emptyItems(count = 0) {
  const items = Array(count);

  for (let i = 0; i < count; i++) {
    items[i] = { id: uniqueId(), item: undefined };
  }

  return items;
}

function itemsInit<T>(items?: T[], minCount?: number): Item<T>[] {
  return (
    items?.map((item) => ({
      id: uniqueId(),
      item,
    })) || emptyItems(minCount)
  );
}

interface UseDynamicListProps<T> {
  items?: T[];
  minCount?: number;
}

export default function useDynamicList<T>({
  items: _items,
  minCount = 0,
}: UseDynamicListProps<T> = {}) {
  const [items, setItems] = useState(() => itemsInit(_items, minCount));
  const subscriptions = useRef(new Set<UpdateCallback<T>>());

  useUpdate(() => {
    const _items = items.map(({ item }) => item);
    subscriptions.current.forEach((sub) => sub(_items));
  }, [items]);

  const updateItem = useRef((index: number, item?: T) =>
    setItems((state) => {
      console.log("updateItem", { index, item });

      if (index < 0 || index >= state.length) return state;

      const newState = [...state];
      newState[index].item = item;
      return newState;
    })
  ).current;

  const appendItem = useRef((item?: T) =>
    setItems((state) => [...state, { id: uniqueId(), item }])
  ).current;

  const prependItem = useRef((item?: T) =>
    setItems((state) => [{ id: uniqueId(), item }, ...state])
  ).current;

  const cloneItem = useRef((index: number) =>
    setItems((state) => {
      const newState = [...state];
      newState.splice(index + 1, 0, {
        id: uniqueId(),
        item: cloneDeep(state[index].item),
      });
      console.log("cloneItem", newState);
      return newState;
    })
  ).current;

  const addItem = useRef((index: number, item?: T) =>
    setItems((state) => {
      const newState = [...state];
      newState.splice(index + 1, 0, { id: uniqueId(), item });
      console.log("addItem", newState);
      return newState;
    })
  ).current;

  const removeItem = useRef((index: number) =>
    setItems((state) => {
      const newState = [...state];
      newState.splice(index, 1);

      if (newState.length < minCount) {
        newState.push(...emptyItems(minCount - newState.length));
      }

      return newState;
    })
  ).current;

  const moveItem = useRef((from: number, to: number) =>
    setItems((state) => {
      const newState = [...state];
      const [target] = newState.splice(from, 1);
      newState.splice(to, 0, target);
      return newState;
    })
  ).current;

  const swapItem = useRef((from: number, to: number) =>
    setItems((state) => {
      const newState = [...state];
      const item1 = newState[from];
      const item2 = newState[to];
      newState[from] = item2;
      newState[to] = item1;
      return newState;
    })
  ).current;

  const replace = useRef((items: T[]) =>
    setItems(itemsInit(items, minCount))
  ).current;

  const subscribe = useRef((callback: UpdateCallback<T>) => {
    subscriptions.current.add(callback);
    return () => {
      subscriptions.current.delete(callback);
    };
  }).current;

  return {
    items,
    updateItem,
    addItem,
    appendItem,
    prependItem,
    cloneItem,
    removeItem,
    moveItem,
    swapItem,
    replace,
    subscribe,
  };
}
