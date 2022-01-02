import { Gender } from "./gender";
import { PhoneMap } from "./phoneNumber";

export interface Student {
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

export interface Students {
  [id: string]: Student;
}

export type StudentValidation = { [K in keyof Required<Student>]: boolean };

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
