import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
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

import { TEMP_REF } from "./temp";

const STUDENTS_REF = collection(TEMP_REF, "students");

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

export const editStudentSchema = newStudentSchema.deepPartial();

export type StudentData = z.infer<typeof newStudentSchema>;

export async function getStudent(id: string) {
  const data = (await getDoc(doc(STUDENTS_REF, id))).data();
  return data && newStudentSchema.parse(data);
}

export function addStudent(data: StudentData) {
  return addDoc(STUDENTS_REF, { ...data, timestamp: new Date() });
}

export function updateStudent(id: string, data: Partial<StudentData>) {
  return updateDoc(doc(STUDENTS_REF, id), { ...data, updateAt: new Date() });
}
