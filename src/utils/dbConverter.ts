import { devOnly } from "utils";
import type {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";
import { Class } from "type-fest";
import { ZodTypeAny } from "zod";

import { DataModel } from "models";

export function dbConverter<T, D1 extends DataModel, S extends ZodTypeAny>(
  DataClass: Class<D1, [string, T]>,
  dbSchema: S
): FirestoreDataConverter<D1> {
  return {
    // FIXME this is expecting a D1 but actually what it's getting is a D2
    toFirestore: (model: D1) => {
      devOnly(() => console.log("toFirestore", model));
      return dbSchema.parse(model.data);
    },
    fromFirestore: (
      snapshot: QueryDocumentSnapshot<DocumentData>,
      options: SnapshotOptions
    ) => new DataClass(snapshot.id, snapshot.data(options) as T),
  };
}
