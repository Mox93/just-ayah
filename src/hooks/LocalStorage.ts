import { isEmpty } from "lodash";
import { Dispatch, SetStateAction, useMemo, useRef } from "react";

import { Converter, SubsetOf, UpdateObject } from "models";
import { applyFilters, applyUpdates, Filter } from "utils";

function getItem<TData>(key: string, parse: Converter<string, TData>) {
  const item = window.localStorage.getItem(key);
  const result = item && parse(item);
  return result || undefined;
}

interface HandleNEsStateProps<TData> {
  key: string;
  newState?: SubsetOf<TData>;
  stringify: Converter<SubsetOf<TData>, string>;
  filter?: Filter<TData>;
}

function handleNewState<TData>({
  key,
  newState,
  stringify,
  filter,
}: HandleNEsStateProps<TData>) {
  if (!isEmpty(newState) && filter) newState = applyFilters(newState!, filter);

  if (isEmpty(newState)) {
    console.log(">>>", { newState, isEmpty: isEmpty(newState) });

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
type UpdateData<TData> = (
  updates: UpdateObject<TData> | SubsetOf<TData>
) => void;

interface UseLocalStorageReturn<TData> {
  data?: SubsetOf<TData>;
  set: SetData<TData>;
  update: UpdateData<TData>;
  refresh: () => SubsetOf<TData> | undefined;
  clear: VoidFunction;
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
  const data = useRef<SubsetOf<TData> | undefined>(
    key ? getItem(key, parse) : undefined
  );

  const set = useRef<SetData<TData>>((valueOrFunction) => {
    data.current = handleNewState({
      key: key!,
      newState:
        typeof valueOrFunction === "function"
          ? (valueOrFunction as Converter<SubsetOf<TData> | undefined>)(
              data.current
            )
          : valueOrFunction,
      stringify,
      filter,
    });
  }).current;

  const update = useRef<UpdateData<TData>>((updates) => {
    data.current = handleNewState({
      key: key!,
      newState:
        updates instanceof Object
          ? applyUpdates(
              data.current instanceof Object ? data.current : {},
              updates
            )
          : updates,
      stringify,
      filter,
    });
  }).current;

  const refresh = useRef(() => {
    data.current = getItem(key!, parse);

    return data.current;
  }).current;

  const clear = useRef(() => {
    window.localStorage.removeItem(key!);
    data.current = undefined;
  }).current;

  return useMemo(
    () =>
      key
        ? {
            data: data.current,
            set,
            update,
            refresh,
            clear,
          }
        : undefined,
    [clear, key, refresh, set, update]
  );
}

export default useLocalStorage;
