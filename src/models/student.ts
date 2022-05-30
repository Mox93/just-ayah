import { get, set } from "react-hook-form";

import { Merge } from "models";
import { dateFromDB, DateInDB } from "models/dateTime";
import { fromYesNo } from "utils";

import { CountryCode } from "./country";
import { Gender } from "./gender";
import { Note, NoteMapInDB, noteListFromDB } from "./note";
import { filterPhoneNumberList, PhoneNumberList } from "./phoneNumber";
import { getStatus, Progress, ProgressInDB, Subscription } from "./status";
import { parseWorkStatus, WorkStatus } from "./work";

interface Meta {
  dateCreated: Date;
  dateUpdated: Date;
  progress?: Progress;
  subscription?: Subscription;
}

type MetaInDB = Merge<
  Meta,
  {
    dateCreated: DateInDB;
    dateUpdated: DateInDB;
    progress: ProgressInDB;
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
  notes?: Note[];
  course?: string;
  teacher?: string;
}

export type StudentInDB = Merge<
  StudentInfo,
  {
    dateOfBirth: DateInDB;
    meta: MetaInDB;
    notes?: NoteMapInDB;
  }
>;

const defaultMeta = (): Meta => {
  const now = new Date();
  return { dateCreated: now, dateUpdated: now, progress: { type: "pending" } };
};

export const studentFromDB = (
  id: string,
  {
    dateOfBirth,
    notes,
    meta: { dateCreated, dateUpdated, progress, subscription, ...meta },
    ...data
  }: StudentInDB
): Student => {
  const now = new Date();

  return {
    ...data,
    id,
    dateOfBirth: dateFromDB(dateOfBirth),
    meta: {
      ...meta,
      dateCreated: dateCreated ? dateFromDB(dateCreated) : now,
      dateUpdated: dateUpdated ? dateFromDB(dateUpdated) : now,
      ...(progress && { progress: getStatus("progress", progress) }),
      ...(subscription && {
        subscription: getStatus("subscription", subscription),
      }),
    },
    notes: notes && noteListFromDB(notes),
  };
};

export const studentFromInfo = ({
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
