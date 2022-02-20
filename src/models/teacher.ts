import { DateInDB } from "models/dateTime";
import { Gender } from "./gender";
import { PhoneNumberInfo } from "./phoneNumber";

const statuses = ["active", "canceled", "postponed"] as const;

interface Meta {
  dateCreated: Date;
  dateUpdated: Date;
  state: string;
}

interface MetaInDB extends Omit<Meta, "dateCreated" | "dateUpdated"> {
  dateCreated: DateInDB;
  dateUpdated: DateInDB;
}

export interface TeacherInfo {
  firstName: string;
  middleName: string;
  lastName: string;
  gender: Gender;
  phoneNumber: PhoneNumberInfo;
  secondaryPhoneNumber?: PhoneNumberInfo[];
  email?: string;
  nationalID: string;
  address: string;
}

export type TeacherValidation = {
  [K in keyof Required<TeacherInfo>]: boolean;
};

export const teacherValidation: TeacherValidation = {
  firstName: false,
  middleName: false,
  lastName: false,
  gender: false,
  phoneNumber: false,
  secondaryPhoneNumber: true,
  email: true,
  nationalID: false,
  address: false,
};

export interface Teacher extends TeacherInfo {
  id: string;
  meta: Meta;
}

export interface TeacherInDB
  extends Omit<Teacher, "id" | "dateOfBirth" | "meta"> {
  dateOfBirth: DateInDB;
  meta: MetaInDB;
}
