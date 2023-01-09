import type {
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";

import { DBModel } from "models/abstract";

export const dbConverter = <T extends typeof DBModel>(Class: T) => ({
  toFirestore: (model: InstanceType<T>) => model.db,
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options: SnapshotOptions
  ) => new Class(snapshot.id, snapshot.data(options)) as InstanceType<T>,
});
