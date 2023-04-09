import {
  CollectionReference,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  startAfter,
  where,
} from "firebase/firestore";

import {
  FetchDataFunc,
  FetchDataOptions,
  DataModel,
  FULFILLED,
  REJECTED,
  ERROR,
} from "models";
import { devOnly } from "utils";

interface GetDocsFactoryProps<T extends DataModel, D> {
  collectionRef: CollectionReference<T>;
  setData: (data: T[]) => void;
  fetchDefaults?: FetchDataOptions<D>;
}

export default function getDocsFactory<T extends DataModel, D = T["data"]>({
  collectionRef,
  fetchDefaults,
  setData,
}: GetDocsFactoryProps<T, D>): FetchDataFunc<D> {
  let lastDoc: QueryDocumentSnapshot<T>;

  fetchDefaults = {
    filters: [],
    size: 20,
    onFulfilled: devOnly((...args) => console.log(FULFILLED, ...args)),
    onRejected: devOnly((...args) => console.log(REJECTED, ...args)),
    onFailed: devOnly((...args) => console.log(ERROR, ...args)),
    ...fetchDefaults,
  };

  return (options) => {
    const {
      filters,
      size,
      sort,
      onFulfilled,
      onRejected,
      onFailed,
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
      ...(lastDoc ? [startAfter(lastDoc)] : [])
    );

    getDocs(q)
      .then((querySnapshot, ...args) => {
        setData(
          querySnapshot.docs
            .map((doc) => doc.data() as T)
            .filter(({ data }) => data)
        );

        if (querySnapshot.size > 0)
          lastDoc = querySnapshot.docs[querySnapshot.size - 1];

        onFulfilled!(querySnapshot, ...args);
      }, onRejected)
      .catch(onFailed)
      .finally(onCompleted);
  };
}
