import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { Path } from "react-hook-form";

import { Filter, UpdateObject } from "models";
import { applyUpdates } from "utils";
import { applyFilter } from "utils/object";

const getItem = <TData>(key: string, parse: (data: string) => TData) => {
  const item = window.localStorage.getItem(key);
  const result = item && parse(item);
  return result || undefined;
};

export interface LocalStorageOptions<
  TData,
  TFieldName extends Path<TData> = Path<TData>
> {
  stringify?: (data: TData) => string;
  parse?: (data: string) => TData;
  filter?: Filter<TFieldName>;
}

type SetData<TData> = Dispatch<SetStateAction<TData>>;
type UpdateData<TData> = (updates: UpdateObject<TData>) => void;

interface UseLocalStorageReturn<TData> {
  data?: Partial<TData>;
  set: SetData<TData>;
  update: UpdateData<TData>;
  refresh: VoidFunction;
  delete: VoidFunction;
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
  const [data, setData] = useState<Partial<TData> | undefined>(
    key ? getItem(key, parse) : undefined
  );

  const set: SetData<TData> = useCallback(
    (valueOrFunction) =>
      key &&
      setData((state) => {
        let newState =
          typeof valueOrFunction === "function"
            ? (valueOrFunction as Function)(state)
            : valueOrFunction;

        if (filter) newState = applyFilter(newState, filter);

        window.localStorage.setItem(key, stringify(newState));
        return newState;
      }),
    [key, filter, stringify]
  );

  const update: UpdateData<TData> = useCallback(
    (updates) => {
      if (key)
        setData((state) => {
          let newState = applyUpdates(state as any, updates);

          if (filter) newState = applyFilter(newState, filter);

          window.localStorage.setItem(key, stringify(newState));
          return newState;
        });
    },
    [key, filter, stringify]
  );

  const refresh = useCallback(
    () => key && setData(getItem(key, parse)),
    [key, parse]
  );

  const _delete = useCallback(() => {
    if (key) {
      window.localStorage.removeItem(key);
      setData(undefined);
    }
  }, [key]);

  return useMemo(
    () => (key ? { data, set, update, refresh, delete: _delete } : undefined),
    [_delete, data, key, refresh, set, update]
  );
}

export default useLocalStorage;
