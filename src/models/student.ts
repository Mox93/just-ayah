import {
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
} from "firebase/firestore";
import { set } from "lodash";

import { DBConverter, Merge } from ".";
import { BooleanLike, booleanToString, toBoolean } from "./boolean";
import { Comment, CommentMapInDB, commentListFromDB } from "./comment";
import { CountryCode } from "./country";
import { Gender } from "./gender";
import { filterPhoneNumberList, PhoneNumberList } from "./phoneNumber";
import { getStatus, Progress, ProgressInDB, Subscription } from "./status";
import { Schedule } from "./schedule";
import {
  parseWorkStatus,
  WorkStatus,
  WorkStatusInfo,
  workStatusToInfo,
} from "./work";

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
  timezone?: string;
  phoneNumber: PhoneNumberList;
  email?: string;
  facebook?: string;
  education: string;
  workStatus: WorkStatusInfo;
  Quran: BooleanLike;
  Zoom: BooleanLike;
  termsOfService?: string;
}

export type Student = Merge<
  StudentInfo,
  {
    id: string;
    meta: Meta;
    workStatus: WorkStatus;
    Quran: boolean;
    Zoom: boolean;
  }
>;

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

export const studentFromInfo = ({
  phoneNumber,
  dateOfBirth,
  governorate,
  email,
  facebook,
  timezone,
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
    Quran: toBoolean(Quran),
    Zoom: toBoolean(Zoom),
    meta: defaultMeta(),
  };

  const optionalData = { governorate, email, facebook, timezone };

  Object.entries(optionalData).forEach(([key, value]) => {
    [undefined, null, ""].includes(value) || set(processedData, key, value);
  });

  return processedData;
};

export const toStudentInfo = ({
  workStatus,
  Quran,
  Zoom,
  ...data
}: Partial<Student>): Partial<StudentInfo> => ({
  ...(workStatus && { workStatus: workStatusToInfo(workStatus) }),
  Quran: booleanToString(Quran),
  Zoom: booleanToString(Zoom),
  ...data,
});

export const studentConverter = {
  toFirestore: (data: any) => studentFromInfo(data),
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options: SnapshotOptions
  ): Student => {
    return studentFromDB(snapshot.id, snapshot.data(options) as StudentInDB);
  },
};
