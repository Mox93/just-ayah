import { doc, setDoc } from "firebase/firestore";
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

interface UseSetDocProps<T> extends BaseCollectionProps<T> {
  DataClass: Class<T>;
}

export default function useSetDoc<T extends DataModel>({
  collectionRef,
  setData,
  DataClass,
}: UseSetDocProps<T>) {
  return useCallback<SetDataFunc<T>>(
    (
      id,
      data,
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
            setData?.((state) => {
              let dataExists = false;
              const newData = new DataClass(id, data.data);
              const newState = state.map((oldData) => {
                if (oldData.id === newData.id) {
                  dataExists = true;
                  return newData;
                }

                return oldData;
              });

              return dataExists ? newState : [newData, ...newState];
            });

          onFulfilled(...args);
        }, onRejected)
        .catch(onFailed)
        .finally(onCompleted);
    },
    [DataClass, collectionRef, setData]
  );
}
