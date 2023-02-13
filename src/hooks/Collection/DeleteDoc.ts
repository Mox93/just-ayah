import { useCallback } from "react";

import { DataModel, DeleteDataFunc } from "models";
import { devOnly } from "utils";

import {
  BaseCollectionProps,
  ERROR,
  FULFILLED,
  REJECTED,
} from "./Collection.types";
import { deleteDoc, doc } from "firebase/firestore";

interface UseDeleteDocProps<T> extends BaseCollectionProps<T> {}

export default function useDeleteDoc<T extends DataModel>({
  collectionRef,
  setData,
}: UseDeleteDocProps<T>) {
  return useCallback<DeleteDataFunc>(
    (
      id,
      {
        onFulfilled = devOnly((...args) => console.log(FULFILLED, ...args)),
        onRejected = devOnly((...args) => console.log(REJECTED, ...args)),
        onFailed = devOnly((...args) => console.log(ERROR, ...args)),
        onCompleted,
        applyLocally,
      } = {}
    ) => {
      const docRef = doc(collectionRef, id);
      deleteDoc(docRef)
        .then((...args) => {
          if (applyLocally)
            setData?.((state) => state.filter(({ id: _id }) => _id !== id));
          onFulfilled(...args);
        }, onRejected)
        .catch(onFailed)
        .finally(onCompleted);
    },
    [collectionRef, setData]
  );
}
