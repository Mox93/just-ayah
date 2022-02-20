import { dateFromDB, DateInDB } from "utils/dateTime";
import { CountryCode } from "./country";
import { Gender } from "./gender";
import { PhoneNumberInfo } from "./phoneNumber";
import { WorkStatus } from "./work";

const statuses = [
  "pending",
  "active",
  "postponed",
  "finished",
  "canceled",
] as const;

type Status = typeof statuses[number];

interface Meta {
  dateCreated: Date;
  dateUpdated: Date;
  status: Status;
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
  dateOfBirth: Date;
  country: CountryCode;
  governorate?: string;
  phoneNumber: PhoneNumberInfo;
  secondaryPhoneNumber?: PhoneNumberInfo[];
  email?: string;
  education: string;
  workStatus: WorkStatus;
  previousQuranMemorization: boolean;
  canUseZoom?: boolean;
}

export type StudentValidation = {
  [K in keyof Required<StudentInfo>]: boolean;
};

export const studentValidator: StudentValidation = {
  firstName: false,
  middleName: false,
  lastName: false,
  gender: false,
  dateOfBirth: false,
  country: false,
  governorate: true,
  phoneNumber: false,
  secondaryPhoneNumber: true,
  email: true,
  education: false,
  workStatus: false,
  previousQuranMemorization: false,
  canUseZoom: false,
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
          status: "pending",
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
