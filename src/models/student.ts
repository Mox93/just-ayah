import { dateFromDB, DateInDB } from "models/dateTime";
import { CountryCode } from "./country";
import { Gender } from "./gender";
import { PhoneNumberInfo } from "./phoneNumber";
import { WorkStatus } from "./work";

export const statuses = [
  "pending",
  "active",
  "postponed",
  "finished",
  "canceled",
] as const;

export type Status = typeof statuses[number];

export type Subscription =
  | { type: "fullPay" | "noPay" }
  | { type: "partialPay"; amount: number };

interface Meta {
  dateCreated: Date;
  dateUpdated: Date;
  status?: Status;
  subscription?: Subscription;
}

interface MetaInDB extends Omit<Meta, "dateCreated" | "dateUpdated"> {
  dateCreated: DateInDB;
  dateUpdated: DateInDB;
}

export interface StudentInfo {
  firstName: string;
  middleName: string;
  lastName: string;
  gender: Gender;
  country: CountryCode;
  governorate?: string;
  dateOfBirth: Date;
  nationality: CountryCode;
  timeZone: string;
  phoneNumbers: { [idx: number]: PhoneNumberInfo };
  email?: string;
  facebook?: string;
  education: string;
  workStatus: WorkStatus;
  Quran: boolean;
  Zoom?: boolean;
}

export type StudentValidation = {
  [K in keyof Required<StudentInfo>]: boolean;
};

export const studentValidation: StudentValidation = {
  firstName: false,
  middleName: false,
  lastName: false,
  gender: false,
  dateOfBirth: false,
  country: false,
  governorate: true,
  nationality: false,
  timeZone: false,
  phoneNumbers: false,
  email: true,
  facebook: true,
  education: false,
  workStatus: false,
  Quran: false,
  Zoom: false,
};

export interface Student extends StudentInfo {
  id: string;
  meta: Meta;
}

export interface StudentInDB
  extends Omit<Student, "id" | "dateOfBirth" | "meta"> {
  dateOfBirth: DateInDB;
  meta: MetaInDB;
}

export const studentFromDB = (id: string, data: StudentInDB): Student => {
  return {
    ...data,
    id,
    dateOfBirth: dateFromDB(data.dateOfBirth),
    meta: data.meta
      ? {
          ...data.meta,
          dateCreated: dateFromDB(data.meta.dateCreated),
          dateUpdated: dateFromDB(data.meta.dateUpdated),
        }
      : {
          dateCreated: new Date(),
          dateUpdated: new Date(),
        },
  };
};

export const studentFromInfo = (data: StudentInfo): Omit<Student, "id"> => {
  const now = new Date();
  return {
    ...data,
    meta: { dateCreated: now, dateUpdated: now, status: "pending" },
  };
};
