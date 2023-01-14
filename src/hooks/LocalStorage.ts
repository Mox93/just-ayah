import { isEmpty } from "lodash";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";

import { Converter, SubsetOf, UpdateObject } from "models";
import { applyFilters, applyUpdates, Filter } from "utils";

function getItem<TData>(key: string, parse: Converter<string, TData>) {
  const item = window.localStorage.getItem(key);
  const result = item && parse(item);
  return result || undefined;
}

function handleNewState<TData>(
  key: string,
  newState: SubsetOf<TData> | undefined,
  stringify: Converter<SubsetOf<TData>, string>,
  filter?: Filter<TData>
) {
  if (!isEmpty(newState) && filter) newState = applyFilters(newState!, filter);

  if (isEmpty(newState)) {
    window.localStorage.removeItem(key);
    return;
  }

  window.localStorage.setItem(key, stringify(newState!));
  return newState;
}

export interface LocalStorageOptions<TData> {
  stringify?: Converter<SubsetOf<TData>, string>;
  parse?: Converter<string, SubsetOf<TData>>;
  filter?: Filter<TData>;
}

type SetData<TData> = Dispatch<SetStateAction<TData>>;
type UpdateData<TData> = (updates: UpdateObject<TData> | TData) => void;

interface UseLocalStorageReturn<TData> {
  data?: SubsetOf<TData>;
  set: SetData<TData>;
  update: UpdateData<TData>;
  refresh: VoidFunction;
  remove: VoidFunction;
}

function useLocalStorage(key: undefined): void;
function useLocalStorage<TData>(
  key: string,
  options?: LocalStorageOptions<TData>
): UseLocalStorageReturn<TData>;
function useLocalStorage<TData>(
  key?: string,
  options?: LocalStorageOptions<TData>
): UseLocalStorageReturn<TData> | undefined;
function useLocalStorage<TData>(
  key?: string,
  {
    stringify = JSON.stringify,
    parse = JSON.parse,
    filter,
  }: LocalStorageOptions<TData> = {}
): UseLocalStorageReturn<TData> | undefined {
  const [data, setData] = useState<SubsetOf<TData> | undefined>(
    key ? getItem(key, parse) : undefined
  );

  const set = useCallback<SetData<TData>>(
    (valueOrFunction) =>
      key &&
      setData((state) => {
        return handleNewState(
          key,
          typeof valueOrFunction === "function"
            ? (valueOrFunction as Converter<SubsetOf<TData> | undefined>)(state)
            : valueOrFunction,
          stringify,
          filter
        );
      }),
    [key, filter, stringify]
  );

  const update = useCallback<UpdateData<TData>>(
    (updates) =>
      key &&
      setData((state) => {
        if (updates instanceof Object) {
          return handleNewState(
            key,
            applyUpdates(state instanceof Object ? state : {}, updates),
            stringify,
            filter
          );
        }

        return updates;
      }),
    [key, filter, stringify]
  );

  const refresh = useCallback(
    () => key && setData(getItem(key, parse)),
    [key, parse]
  );

  const remove = useCallback(() => {
    if (key) {
      window.localStorage.removeItem(key);
      setData(undefined);
    }
  }, [key]);

  return useMemo<UseLocalStorageReturn<TData> | undefined>(
    () => (key ? { data, set, update, refresh, remove } : undefined),
    [data, key, refresh, remove, set, update]
  );
}

export default useLocalStorage;
