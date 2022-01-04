import { Gender } from "./gender";
import { PhoneMap } from "./phoneNumber";

export interface Teacher {
  firstName: string;
  middleName: string;
  lastName: string;
  gender: Gender;
  phoneNumber: PhoneMap;
  secondaryPhoneNumber?: PhoneMap[];
  email?: string;
}

export interface Teachers {
  [id: string]: Teacher;
}

export type StudentValidation = { [K in keyof Required<Teacher>]: boolean };

export const studentValidator: StudentValidation = {
  firstName: false,
  middleName: false,
  lastName: false,
  gender: false,
  phoneNumber: false,
  secondaryPhoneNumber: true,
  email: true,
};
