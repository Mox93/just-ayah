import { cloneDeep } from "lodash";
import {
  useFieldArray as _useFieldArray,
  UseFieldArrayProps as _UseFieldArrayProps,
  FieldArray,
  FieldArrayMethodProps,
  FieldArrayPath,
} from "react-hook-form";

import { useApplyOnce, useRefSync } from "hooks";

export interface UseFieldArrayProps<
  T extends {},
  N extends FieldArrayPath<T>,
  K extends string = "id"
> extends _UseFieldArrayProps<T, N, K> {
  emptyItem: FieldArray<T, N>;
  minCount?: number;
}

type FieldOrFieldArray<T extends {}, N extends FieldArrayPath<T>> =
  | FieldArray<T, N>
  | FieldArray<T, N>[];

export default function useFieldArray<
  T extends {},
  N extends FieldArrayPath<T>,
  K extends string = "id"
>({ emptyItem, minCount = 1, ...props }: UseFieldArrayProps<T, N, K>) {
  const { keyName = "id" as K } = props;

  const { fields, append, prepend, insert, update, remove, ...rest } =
    _useFieldArray(props);

  const appendRef = useRefSync(
    (item?: FieldOrFieldArray<T, N> | null, options?: FieldArrayMethodProps) =>
      append(item || emptyItem, options)
  );

  const prependRef = useRefSync(
    (item?: FieldOrFieldArray<T, N> | null, options?: FieldArrayMethodProps) =>
      prepend(item || emptyItem, options)
  );

  const insertRef = useRefSync(
    (
      index: number,
      item?: FieldOrFieldArray<T, N> | null,
      options?: FieldArrayMethodProps
    ) => insert(index, item || emptyItem, options)
  );

  const cloneRef = useRefSync(
    (index: number, options?: FieldArrayMethodProps) => {
      if (index >= fields.length) return;

      const field = cloneDeep(fields[index]);
      delete field[keyName];

      insert(index + 1, field, options);
    }
  );

  const resetRef = useRefSync((index: number) => update(index, emptyItem));

  const removeRef = useRefSync((index?: number | number[]) => {
    remove(index);

    if (typeof index === "number" && index < fields.length) {
      for (let i = 0; i < minCount - (fields.length - 1); i++) {
        appendRef.current(emptyItem);
      }
    } else if (Array.isArray(index)) {
      const newCount =
        fields.length - index.filter((idx) => idx < fields.length).length;

      if (newCount < minCount)
        for (let i = 0; i < minCount - newCount; i++) {
          appendRef.current(emptyItem);
        }
    }
  });

  useApplyOnce(() => {
    for (let i = 0; i < minCount - fields.length; i++) {
      appendRef.current(emptyItem);
    }
  });

  return {
    append: appendRef.current,
    prepend: prependRef.current,
    insert: insertRef.current,
    clone: cloneRef.current,
    reset: resetRef.current,
    remove: removeRef.current,
    fields,
    update,
    ...rest,
  };
}
