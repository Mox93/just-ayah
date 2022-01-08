import { dateFromDB, DateInDB } from "../utils/datetime";
import { Gender } from "./gender";
import { PhoneMap } from "./phoneNumber";

interface Meta {
  dateCreated: Date;
  dateUpdated: Date;
  state: string;
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
  country: string;
  governorate?: string;
  phoneNumber: PhoneMap;
  secondaryPhoneNumber?: PhoneMap[];
  email?: string;
  education: string;
  occupation: string;
  previousQuranMemorization: boolean;
  canUseZoom?: boolean;
}

export type StudentValidation = {
  [K in keyof Required<Omit<StudentInfo, "meta">>]: boolean;
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
  occupation: false,
  previousQuranMemorization: false,
  canUseZoom: true,
};

export interface Student extends StudentInfo {
  id: string;
  meta: Meta;
}

export interface StudentInDB
  extends Omit<StudentInfo, "id" | "gender" | "dateOfBirth" | "meta"> {
  gender: string;
  dateOfBirth: DateInDB;
  meta: MetaInDB;
}

export const studentFromDB = (id: string, data: StudentInDB): Student => {
  return {
    ...data,
    id,
    gender: data.gender as Gender,
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
          state: "pending",
        },
  };
};

export const studentFromInfo = (data: StudentInfo): Omit<Student, "id"> => {
  const now = new Date();
  return {
    ...data,
    meta: { dateCreated: now, dateUpdated: now, state: "pending" },
  };
};
