import { CollectionReference } from "firebase/firestore";
import { Dispatch, SetStateAction } from "react";

export const FULFILLED = "FULFILLED";
export const REJECTED = "REJECTED";
export const ERROR = "ERROR";

export interface BaseCollectionProps<T> {
  collectionRef: CollectionReference<T>;
  setData?: Dispatch<SetStateAction<T[]>>;
}
