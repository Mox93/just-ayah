import { CollectionReference, doc, setDoc } from "firebase/firestore";
import { useCallback } from "react";
import { Class } from "type-fest";

import { DataModel, SetDataFunc } from "models";
import { devOnly } from "utils";

import {
  BaseCollectionProps,
  ERROR,
  FULFILLED,
  REJECTED,
} from "./Collection.types";

interface UseSetDocProps<T, D> extends Pick<BaseCollectionProps<T>, "setData"> {
  collectionRef: CollectionReference<D>;
  DataClass: Class<T>;
}

export default function useSetDoc<T extends DataModel, D extends DataModel>({
  collectionRef,
  setData,
  DataClass,
}: UseSetDocProps<T, D>) {
  return useCallback<SetDataFunc<D>>(
    (
      id,
      { data },
      {
        onFulfilled = devOnly((...args) => console.log(FULFILLED, ...args)),
        onRejected = devOnly((...args) => console.log(REJECTED, ...args)),
        onFailed = devOnly((...args) => console.log(ERROR, ...args)),
        onCompleted,
        applyLocally,
      } = {}
    ) => {
      setDoc(doc(collectionRef, id), data)
        .then((...args) => {
          if (applyLocally)
            setData?.((state) => [new DataClass(id, data), ...state]);
          onFulfilled(...args);
        }, onRejected)
        .catch(onFailed)
        .finally(onCompleted);
    },
    [DataClass, collectionRef, setData]
  );
}
