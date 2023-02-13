import { CollectionReference, doc, updateDoc } from "firebase/firestore";
import { useCallback } from "react";

import { GenericObject, DataModel, UpdateDataFunc } from "models";
import { devOnly } from "utils";

import {
  BaseCollectionProps,
  ERROR,
  FULFILLED,
  REJECTED,
} from "./Collection.types";

interface UseUpdateDocProps<U extends GenericObject, T>
  extends Pick<BaseCollectionProps<T>, "setData"> {
  collectionRef: CollectionReference<U>;
}

export default function useUpdateDoc<
  U extends GenericObject,
  T extends DataModel
>({ collectionRef, setData }: UseUpdateDocProps<U, T>) {
  return useCallback<UpdateDataFunc<U>>(
    (
      id,
      updates,
      {
        onFulfilled = devOnly((...args) => console.log(FULFILLED, ...args)),
        onRejected = devOnly((...args) => console.log(REJECTED, ...args)),
        onFailed = devOnly((...args) => console.log(ERROR, ...args)),
        onCompleted,
        applyLocally,
      } = {}
    ) => {
      updateDoc(doc(collectionRef, id), updates)
        .then((...args) => {
          if (applyLocally)
            setData?.((state) =>
              state.map((data) =>
                // FIXME is it okay to use the same updates for both updateDoc and data.update?
                data.id === id ? data.update(updates) : data
              )
            );

          onFulfilled(...args);
        }, onRejected)
        .catch(onFailed)
        .finally(onCompleted);
    },
    [collectionRef, setData]
  );
}
