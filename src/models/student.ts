import { dateFromDB, DateInDB } from "models/dateTime";
import { CountryCode } from "./country";
import { Gender } from "./gender";
import { Note, NoteMapInDB, noteListFromDB } from "./note";
import { PhoneNumberInfo } from "./phoneNumber";
import {
  StudentStatus,
  statusFromDB,
  StudentStatusInDB,
} from "./studentStatus";
import { Subscription } from "./subscription";
import { WorkStatus } from "./work";

interface Meta {
  dateCreated: Date;
  dateUpdated: Date;
  status?: StudentStatus;
  subscription?: Subscription;
}

interface MetaInDB
  extends Omit<Meta, "dateCreated" | "dateUpdated" | "status"> {
  dateCreated: DateInDB;
  dateUpdated: DateInDB;
  status: StudentStatusInDB;
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
  notes?: Note[];
}

export interface StudentInDB
  extends Omit<Student, "id" | "dateOfBirth" | "meta" | "notes"> {
  dateOfBirth: DateInDB;
  meta: MetaInDB;
  notes?: NoteMapInDB;
}

export const studentFromDB = (id: string, data: StudentInDB): Student => {
  return {
    ...data,
    id,
    dateOfBirth: dateFromDB(data.dateOfBirth),
    meta: {
      ...data.meta,
      dateCreated: dateFromDB(data.meta.dateCreated),
      dateUpdated: dateFromDB(data.meta.dateUpdated),
      status: statusFromDB(data.meta.status),
    },
    notes: data.notes && noteListFromDB(data.notes),
  };
};

export const studentFromInfo = (data: StudentInfo): Omit<Student, "id"> => {
  const now = new Date();
  return {
    ...data,
    meta: { dateCreated: now, dateUpdated: now, status: { type: "pending" } },
  };
};
