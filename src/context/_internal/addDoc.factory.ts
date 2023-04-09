import { addDoc, CollectionReference } from "firebase/firestore";
import { Class } from "type-fest";

import { AddDataFunc, DataModel, ERROR, FULFILLED, REJECTED } from "models";
import { devOnly } from "utils";

interface AddDocFactoryProps<T> {
  collectionRef: CollectionReference<T>;
  setData: (data: T) => void;
  DataClass: Class<T>;
}

export default function addDocFactory<T extends DataModel>({
  collectionRef,
  setData,
  DataClass,
}: AddDocFactoryProps<T>): AddDataFunc<T> {
  return (
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
        if (applyLocally) setData(new DataClass(docRef.id, data.data));
        onFulfilled(docRef, ...args);
      }, onRejected)
      .catch(onFailed)
      .finally(onCompleted);
  };
}
