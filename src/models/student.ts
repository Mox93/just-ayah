import {
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
} from "firebase/firestore";
import { get, set } from "react-hook-form";

import { fromYesNo } from "utils";

import { Merge } from ".";
import { CountryCode } from "./country";
import { Gender } from "./gender";
import { Comment, CommentMapInDB, commentListFromDB } from "./comment";
import { filterPhoneNumberList, PhoneNumberList } from "./phoneNumber";
import { getStatus, Progress, ProgressInDB, Subscription } from "./status";
import { parseWorkStatus, WorkStatus } from "./work";

interface Meta {
  dateCreated: Date;
  dateUpdated: Date;
  progress?: Progress;
  subscription?: Subscription;
  notes?: Comment[];
  course?: string;
  teacher?: string;
}

type MetaInDB = Merge<
  Meta,
  {
    dateCreated: Timestamp;
    dateUpdated: Timestamp;
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

export interface StudentEnroll extends Partial<Student> {
  awaitEnroll: boolean;
  openedAt: Date;
}

export type StudentEnrollInDB = Merge<
  StudentEnroll,
  {
    openedAt: Timestamp;
  }
>;

const isEnroll = (obj: any): obj is StudentEnroll => obj.awaitEnroll;

export const defaultMeta = (): Meta => {
  const now = new Date();
  return { dateCreated: now, dateUpdated: now, progress: { type: "pending" } };
};

const studentFromDB = (
  id: string,
  { dateOfBirth, meta, ...data }: StudentInDB
): Student => {
  const now = new Date();

  const { dateCreated, dateUpdated, progress, subscription, notes, ..._meta } =
    meta || {};

  return {
    ...data,
    id,
    ...(dateOfBirth && { dateOfBirth: dateOfBirth.toDate() }),
    meta: meta
      ? {
          ..._meta,
          dateCreated: dateCreated ? dateCreated.toDate() : now,
          dateUpdated: dateUpdated ? dateUpdated.toDate() : now,
          ...(progress && { progress: getStatus("progress", progress) }),
          ...(subscription && {
            subscription: getStatus("subscription", subscription),
          }),
          ...(notes && { notes: commentListFromDB(notes) }),
        }
      : defaultMeta(),
  };
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
  toFirestore: (data: any) => (isEnroll(data) ? data : studentFromInfo(data)),
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options: SnapshotOptions
  ): Student => {
    return studentFromDB(snapshot.id, snapshot.data(options) as StudentInDB);
  },
};
