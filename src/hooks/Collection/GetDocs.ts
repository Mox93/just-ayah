import {
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  startAfter,
  where,
} from "firebase/firestore";
import { useCallback, useRef } from "react";

import { FetchDataFunc, FetchDataOptions, DataModel } from "models";
import { devOnly } from "utils";

import {
  BaseCollectionProps,
  ERROR,
  FULFILLED,
  REJECTED,
} from "./Collection.types";

interface UseGetDocsProps<T extends DataModel, D>
  extends Required<BaseCollectionProps<T>> {
  fetchDefaults?: FetchDataOptions<D>;
}

export default function useGetDocs<T extends DataModel, D = T["data"]>({
  collectionRef,
  fetchDefaults,
  setData,
}: UseGetDocsProps<T, D>) {
  fetchDefaults = {
    filters: [],
    size: 20,
    onFulfilled: devOnly((...args) => console.log(FULFILLED, ...args)),
    onRejected: devOnly((...args) => console.log(REJECTED, ...args)),
    ...fetchDefaults,
  };

  const lastDoc = useRef<QueryDocumentSnapshot<T>>();

  return useCallback<FetchDataFunc<D>>(
    (options) => {
      const {
        filters,
        size,
        sort,
        onFulfilled,
        onRejected,
        onFailed = devOnly((...args) => console.log(ERROR, ...args)),
        onCompleted,
      } = {
        ...fetchDefaults,
        ...options,
      };
      const q = query(
        collectionRef,
        ...filters!.map((filter) => where(...filter)),
        limit(size!),
        ...(sort ? [orderBy(sort.by, sort.direction)] : []),
        ...(lastDoc.current ? [startAfter(lastDoc.current)] : [])
      );

      getDocs(q)
        .then((querySnapshot, ...args) => {
          setData((state) => [
            ...state,
            ...querySnapshot.docs
              .map((doc) => doc.data() as T)
              .filter(({ data }) => data),
          ]);

          if (querySnapshot.size > 0)
            lastDoc.current = querySnapshot.docs[querySnapshot.size - 1];

          onFulfilled!(querySnapshot, ...args);
        }, onRejected)
        .catch(onFailed)
        .finally(onCompleted);
    },
    [collectionRef, fetchDefaults, setData]
  );
}
