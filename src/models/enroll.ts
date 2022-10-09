import { DBConverter } from "./customTypes";
import { shiftDate } from "./dateTime";
import {
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
} from "firebase/firestore";

import { Merge } from ".";
// import { Student, studentFromDB, StudentInDB } from "./student";

export interface EnrollInfo {
  key?: string;
  duration?: number;
}

interface Enroll {
  key?: string;
  awaiting: boolean;
  expiresAt: Date;
  dateCreated: Date;
}

type EnrollInDB = Merge<
  Enroll,
  { expiresAt: Timestamp; dateCreated: Timestamp }
>;

export type UserEnroll<TUser> = Merge<
  Partial<TUser>,
  { id: string; enroll: Enroll }
>;

export type UserEnrollInDB<TUserInDB> = Merge<
  Partial<TUserInDB>,
  { enroll: EnrollInDB }
>;

const userEnrollFromDB = <TUserInDB, TUser>(
  id: string,
  {
    enroll: { expiresAt, dateCreated, ...enroll },
    ...data
  }: UserEnrollInDB<TUserInDB>,
  userFromDB: DBConverter<TUserInDB, TUser>
): UserEnroll<TUser> => ({
  enroll: {
    ...enroll,
    expiresAt: expiresAt.toDate(),
    dateCreated: dateCreated.toDate(),
  },
  ...userFromDB(id, data as any),
});

export const userEnrollFromInfo = <TUser>({
  key,
  duration = 48,
}: EnrollInfo = {}): Omit<UserEnroll<TUser>, "id"> => {
  const now = new Date();

  return {
    enroll: {
      ...(key && { key }),
      awaiting: true,
      expiresAt: shiftDate(now, { hour: duration }),
      dateCreated: now,
    },
  } as Omit<UserEnroll<TUser>, "id">;
};

export const userEnrollConverter = <TUserInDB, TUser>(
  userFromDB: DBConverter<TUserInDB, TUser>
) => ({
  toFirestore: (data: any) => userEnrollFromInfo<TUser>(data),
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options: SnapshotOptions
  ) =>
    userEnrollFromDB(
      snapshot.id,
      snapshot.data(options) as UserEnrollInDB<TUserInDB>,
      userFromDB
    ),
});

export const enrollLinkFromId = (id: string, key: string) =>
  `${window.location.protocol}//${window.location.host}/${key}/new/${id}`;
