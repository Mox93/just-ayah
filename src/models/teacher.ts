import {
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
} from "firebase/firestore";
import { get, set } from "react-hook-form";

import { DBConverter, Merge } from ".";
import { filterPhoneNumberList, Gender, PhoneNumberList } from "./blocks";

interface Meta {
  dateCreated: Date;
  dateUpdated?: Date;
}

type MetaInDB = Merge<
  Meta,
  {
    dateCreated: Timestamp;
    dateUpdated?: Timestamp;
  }
>;

export interface TeacherInfo {
  firstName: string;
  middleName: string;
  lastName: string;
  gender: Gender;
  phoneNumber: PhoneNumberList;
  email?: string;
  nationalID?: string;
  address?: string;
}

export interface Teacher extends TeacherInfo {
  id: string;
  meta: Meta;
}

export type TeacherInDB = Merge<Omit<Teacher, "id">, { meta: MetaInDB }>;

export const defaultMeta = (): Meta => {
  const now = new Date();
  return { dateCreated: now };
};

export const teacherFromDB: DBConverter<TeacherInDB, Teacher> = (
  id,
  { meta, ...data }
) => {
  const now = new Date();

  const { dateCreated, dateUpdated, ..._meta } = meta || {};

  return {
    ...data,
    id,
    ...(meta && {
      meta: {
        ..._meta,
        dateCreated: dateCreated ? dateCreated.toDate() : now,
        ...(dateUpdated && { dateUpdated: dateUpdated.toDate() }),
      },
    }),
  } as any;
};

const teacherFromInfo = ({
  phoneNumber,
  email,
  nationalID,
  address,
  ...data
}: TeacherInfo) => {
  const processedData: Omit<Teacher, "id"> = {
    ...data,
    phoneNumber: filterPhoneNumberList(phoneNumber),
    meta: defaultMeta(),
  };

  const optionalData = { email, nationalID, address };

  for (let key in optionalData) {
    const value = get(optionalData, key);
    if (value) set(processedData, key, value);
  }

  return processedData;
};

export const teacherConverter = {
  toFirestore: (data: any) => teacherFromInfo(data),
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options: SnapshotOptions
  ): Teacher => {
    return teacherFromDB(snapshot.id, snapshot.data(options) as TeacherInDB);
  },
};
