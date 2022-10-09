import {
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
} from "firebase/firestore";
import { get, set } from "react-hook-form";

import { fromYesNo } from "utils";

import { DBConverter, Merge } from ".";
import { CountryCode } from "./country";
import { Gender } from "./gender";
import { Comment, CommentMapInDB, commentListFromDB } from "./comment";
import { filterPhoneNumberList, PhoneNumberList } from "./phoneNumber";
import { getStatus, Progress, ProgressInDB, Subscription } from "./status";
import { parseWorkStatus, WorkStatus } from "./work";
import { Schedule } from "./schedule";

interface Meta {
  dateCreated: Date;
  dateUpdated?: Date;
  progress?: Progress;
  subscription?: Subscription;
  notes?: Comment[];
  course?: string;
  teacher?: string;
  schedule?: Schedule;
}

type MetaInDB = Merge<
  Meta,
  {
    dateCreated: Timestamp;
    dateUpdated?: Timestamp;
    progress: ProgressInDB;
    notes?: CommentMapInDB;
  }
>;

export interface StudentInfo {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: Gender;
  nationality: CountryCode;
  country: CountryCode;
  governorate?: string;
  timezone: string;
  phoneNumber: PhoneNumberList;
  email?: string;
  facebook?: string;
  education: string;
  workStatus: WorkStatus;
  Quran: boolean;
  Zoom: boolean;
}

export interface Student extends StudentInfo {
  id: string;
  meta: Meta;
}

export type StudentInDB = Merge<
  StudentInfo,
  {
    dateOfBirth: Timestamp;
    meta: MetaInDB;
  }
>;

export const defaultMeta = (): Meta => {
  const now = new Date();
  return { dateCreated: now, progress: { type: "pending" } };
};

export const studentFromDB: DBConverter<StudentInDB, Student> = (
  id,
  { dateOfBirth, meta, ...data }
) => {
  const now = new Date();

  const { dateCreated, dateUpdated, progress, subscription, notes, ..._meta } =
    meta || {};

  return {
    ...data,
    id,
    ...(dateOfBirth && { dateOfBirth: dateOfBirth.toDate() }),
    ...(meta && {
      meta: {
        ..._meta,
        dateCreated: dateCreated ? dateCreated.toDate() : now,
        ...(dateUpdated && { dateUpdated: dateUpdated.toDate() }),
        ...(progress && { progress: getStatus("progress", progress) }),
        ...(subscription && {
          subscription: getStatus("subscription", subscription),
        }),
        ...(notes && { notes: commentListFromDB(notes) }),
      },
    }),
  } as any;
};

const studentFromInfo = ({
  phoneNumber,
  dateOfBirth,
  governorate,
  email,
  facebook,
  workStatus,
  Quran,
  Zoom,
  ...data
}: StudentInfo) => {
  const processedData: Omit<Student, "id"> = {
    ...data,
    dateOfBirth: new Date(dateOfBirth),
    phoneNumber: filterPhoneNumberList(phoneNumber),
    workStatus: parseWorkStatus(workStatus),
    Quran: fromYesNo(Quran),
    Zoom: fromYesNo(Zoom),
    meta: defaultMeta(),
  };

  const optionalData = { governorate, email, facebook };

  for (let key in optionalData) {
    const value = get(optionalData, key);
    if (value !== undefined) set(processedData, key, value);
  }

  return processedData;
};

export const studentConverter = {
  toFirestore: (data: any) => studentFromInfo(data),
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options: SnapshotOptions
  ): Student => {
    return studentFromDB(snapshot.id, snapshot.data(options) as StudentInDB);
  },
};
