import type {
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";
import { Class } from "type-fest";

import { GenericObject } from "models";

interface DBModel {
  data: GenericObject;
}

export const dbConverter = <T extends DBModel>(
  DBClass: Class<T, [string, GenericObject]>
) => ({
  toFirestore: (model: T) => model.data,
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options: SnapshotOptions
  ) => new DBClass(snapshot.id, snapshot.data(options)),
});
