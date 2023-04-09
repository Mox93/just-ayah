import {
  CollectionReference,
  doc,
  UpdateData,
  updateDoc,
} from "firebase/firestore";

import {
  GenericObject,
  UpdateDataFunc,
  Converter,
  FULFILLED,
  REJECTED,
  ERROR,
} from "models";
import { devOnly } from "utils";

interface UpdateDocFactoryProps<T> {
  collectionRef: CollectionReference<T>;
  setData: (id: string, updates: UpdateData<T>) => void;
  processUpdates?: Converter<UpdateData<T>>;
}

export default function updateDocFactory<T extends GenericObject>({
  collectionRef,
  setData,
  processUpdates,
}: UpdateDocFactoryProps<T>): UpdateDataFunc<T> {
  return (
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
    if (processUpdates) {
      updates = processUpdates(updates);
    }

    updateDoc(doc(collectionRef, id), updates)
      .then((...args) => {
        if (applyLocally)
          // FIXME is it okay to use the same updates for both updateDoc and data.update?
          setData(id, updates);

        onFulfilled(...args);
      }, onRejected)
      .catch(onFailed)
      .finally(onCompleted);
  };
}
