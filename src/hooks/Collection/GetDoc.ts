import { doc, getDoc } from "firebase/firestore";
import { useCallback, useRef } from "react";

import { GetDataFunc } from "models";

import { BaseCollectionProps } from "./Collection.types";

interface UseGetDocProps<T>
  extends Pick<BaseCollectionProps<T>, "collectionRef"> {}

export default function useGetDoc<T>({ collectionRef }: UseGetDocProps<T>) {
  const { current: cachedData } = useRef(new Map<string, T>());

  return useCallback<GetDataFunc<T>>(
    async (id, { fresh, cache = true } = {}) => {
      if (!fresh && cachedData.has(id)) return cachedData.get(id);

      const result = await getDoc(doc(collectionRef, id));
      const data = result.data() as T;

      if (cache) cachedData.set(id, data);

      return data;
    },
    [cachedData, collectionRef]
  );
}
