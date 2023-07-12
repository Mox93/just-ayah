import { addDoc, collection } from "firebase/firestore";
import { z } from "zod";

import {
  booleanSchema,
  countryCodeSchema,
  dateSchema,
  emailSchema,
  genderSchema,
  leadsSchema,
  simplePhoneNumberListSchema,
  urlSchema,
} from "models/blocks";

import { tempRef } from "./temp";

const studentsRef = collection(tempRef, "students");

export const newStudentSchema = z.object({
  name: z.string(),
  gender: genderSchema,
  dateOfBirth: dateSchema,
  nationality: countryCodeSchema,
  country: countryCodeSchema,
  governorate: z.string(),
  phoneNumber: simplePhoneNumberListSchema,
  email: emailSchema,
  facebook: urlSchema,
  education: z.string(),
  job: z.string(),
  quran: booleanSchema,
  zoom: booleanSchema,
  zoomTestSession: booleanSchema,
  telegram: booleanSchema,
  lead: leadsSchema,
  leadOther: z.string().optional(),
  termsOfService: z.string(),
});

export type NewStudent = z.infer<typeof newStudentSchema>;

export async function addStudent(data: NewStudent) {
  console.log("addStudent", data);

  return await addDoc(studentsRef, { ...data, timestamp: new Date() });
}
