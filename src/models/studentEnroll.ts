import { shiftDate } from "./dateTime";
import {
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
} from "firebase/firestore";

import { Merge } from ".";
import { Student, studentFromDB, StudentInDB } from "./student";

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
  {
    expiresAt: Timestamp;
    dateCreated: Timestamp;
  }
>;

export interface StudentEnroll extends Partial<Student> {
  id: string;
  enroll: Enroll;
}

export interface StudentEnrollInDB extends Partial<StudentInDB> {
  enroll: EnrollInDB;
}

const studentEnrollFromDB = (
  id: string,
  { enroll: { expiresAt, dateCreated, ...enroll }, ...data }: StudentEnrollInDB
) => ({
  enroll: {
    ...enroll,
    expiresAt: expiresAt.toDate(),
    dateCreated: dateCreated.toDate(),
  },
  ...studentFromDB(id, data),
});

export const studentEnrollFromInfo = ({
  key,
  duration = 48,
}: EnrollInfo = {}): Omit<StudentEnroll, "id"> => {
  const now = new Date();

  return {
    enroll: {
      ...(key && { key }),
      awaiting: true,
      expiresAt: shiftDate(now, { hour: duration }),
      dateCreated: now,
    },
  };
};

export const studentEnrollConverter = {
  toFirestore: (data: any) => studentEnrollFromInfo(data),
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options: SnapshotOptions
  ): StudentEnroll => {
    return studentEnrollFromDB(
      snapshot.id,
      snapshot.data(options) as StudentEnrollInDB
    );
  },
};

export const enrollLinkFromId = (id: string) =>
  `${window.location.protocol}//${window.location.host}/students/new/${id}`;
