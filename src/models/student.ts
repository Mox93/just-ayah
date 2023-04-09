import { countryCodeSchema } from "./blocks/country";
import { z } from "zod";

import { dbConverter } from "utils";

import {
  DataModel,
  ExternalUser,
  externalUserSchema,
  BaseModel,
} from "./abstract";
import { dateSchema } from "./blocks";
import { courseIndexSchema } from "./course";
import {
  booleanSchema,
  commentListSchema,
  commentMapSchema,
  countrySchema,
  genderSchema,
  phoneNumberListSchema,
  progressSchema,
  scheduleSchema,
  simplePhoneNumberListSchema,
  subscriptionSchema,
  timezoneCodeSchema,
  timezoneSchema,
  trackableSchema,
  userIndexSchema,
  workStatusSchema,
} from "./blocks";
import { paymentRefSchema } from "./payment";

const metaSchema = trackableSchema.merge(
  z
    .object({
      course: courseIndexSchema,
      teacher: userIndexSchema,
      schedule: scheduleSchema,
      sessions: z.number().int().positive(),
      lead: z.string(),
      termsOfService: z.string(),
      progress: progressSchema,
      subscription: subscriptionSchema,
      payment: paymentRefSchema,
      notes: commentListSchema,
      useTelegram: booleanSchema,
      quran: booleanSchema,
      zoom: z
        .object({ canUse: booleanSchema, needTutorial: booleanSchema })
        .partial(),
    })
    .partial()
);

const metaDBSchema = metaSchema.extend({ notes: commentMapSchema }).partial();

const studentSchema = z.object({
  firstName: z.string(),
  middleName: z.string().optional(), // TODO make required once all data is valid in the DB
  lastName: z.string(),
  gender: genderSchema,
  governorate: z.string().optional(),
  email: z.string().email().optional(),
  facebook: z.string().url().optional(),
  education: z.string(),
  dateOfBirth: dateSchema,
  nationality: countrySchema,
  country: countrySchema,
  timezone: timezoneSchema.optional(),
  phoneNumber: phoneNumberListSchema,
  workStatus: workStatusSchema,
  meta: metaSchema.default({}),
});

const simpleFields = {
  phoneNumber: simplePhoneNumberListSchema,
  nationality: countryCodeSchema,
  country: countryCodeSchema,
  timezone: timezoneCodeSchema.optional(),
};

const studentDBSchema = studentSchema.extend({
  ...simpleFields,
  meta: metaDBSchema.default({}),
});

const studentFormSchema = studentSchema.extend(simpleFields);

export default class Student extends DataModel(studentSchema) {
  static DB = BaseModel(studentDBSchema);
}

const studentEnrollSchema = studentSchema
  .deepPartial()
  .merge(externalUserSchema);

const studentEnrollDBSchema = studentDBSchema
  .deepPartial()
  .merge(externalUserSchema);

export class StudentEnroll extends ExternalUser(
  studentEnrollSchema,
  "students/new"
) {
  static DB = BaseModel(studentEnrollDBSchema);
}

export const studentConverter = dbConverter(Student, studentDBSchema);
export const studentEnrollConverter = dbConverter(
  StudentEnroll,
  studentEnrollDBSchema
);

export type StudentDB = InstanceType<typeof Student.DB>;
export type StudentDBData = StudentDB["data"];

export type StudentEnrollDB = InstanceType<typeof StudentEnroll.DB>;
export type StudentEnrollDBData = StudentEnrollDB["data"];

export type StudentFormData = z.infer<typeof studentFormSchema>;
