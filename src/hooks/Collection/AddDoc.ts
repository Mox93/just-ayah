import { addDoc } from "firebase/firestore";
import { useCallback } from "react";
import { Class } from "type-fest";

import { AddDataFunc, DataModel } from "models";
import { devOnly } from "utils";

import {
  BaseCollectionProps,
  ERROR,
  FULFILLED,
  REJECTED,
} from "./Collection.types";

interface UseAddDocProps<T> extends BaseCollectionProps<T> {
  DataClass: Class<T>;
}

export default function useAddDoc<T extends DataModel>({
  collectionRef,
  setData,
  DataClass,
}: UseAddDocProps<T>) {
  return useCallback<AddDataFunc<T>>(
    (
      data,
      {
        onFulfilled = devOnly((...args) => console.log(FULFILLED, ...args)),
        onRejected = devOnly((...args) => console.log(REJECTED, ...args)),
        onFailed = devOnly((...args) => console.log(ERROR, ...args)),
        onCompleted,
        applyLocally,
      } = {}
    ) => {
      addDoc(collectionRef, data)
        .then((docRef, ...args) => {
          if (applyLocally)
            setData?.((state) => [
              new DataClass(docRef.id, data.data),
              ...state,
            ]);
          onFulfilled(docRef, ...args);
        }, onRejected)
        .catch(onFailed)
        .finally(onCompleted);
    },
    [DataClass, collectionRef, setData]
  );
}
