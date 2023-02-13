import { z } from "zod";

import { dbConverter } from "utils";

import {
  DataModel,
  ExternalUser,
  externalUserSchema,
  BaseModel,
} from "./abstract";
import {
  booleanSchema,
  commentListSchema,
  commentMapSchema,
  countrySchema,
  genderSchema,
  phoneNumberListSchema,
  scheduleSchema,
  simplePhoneNumberListSchema,
  timezoneSchema,
  trackableSchema,
} from "./blocks";
import { dateSchema } from "./_blocks";

const metaSchema = trackableSchema.merge(
  z
    .object({
      schedule: scheduleSchema,
      dailyHours: z.number().int(),
      leads: z.string(),
      termsOfService: z.string(),
      notes: commentListSchema,
      useTelegram: booleanSchema,
      zoom: z
        .object({ canUse: booleanSchema, needTutorial: booleanSchema })
        .partial(),
    })
    .partial()
);

const metaDBSchema = metaSchema.extend({ notes: commentMapSchema.optional() });

const teacherSchema = z.object({
  firstName: z.string(),
  middleName: z.string(),
  lastName: z.string(),
  gender: genderSchema,
  governorate: z.string().optional(),
  email: z.string().email().optional(),
  facebook: z.string().url().optional(),
  dateOfBirth: dateSchema,
  nationality: countrySchema,
  country: countrySchema,
  nationalID: z.string().optional(),
  timezone: z.optional(timezoneSchema),
  phoneNumber: phoneNumberListSchema,
  meta: metaSchema.default({}),
});

const teacherDBSchema = teacherSchema.merge(
  z.object({
    meta: metaDBSchema.default({}),
    phoneNumber: simplePhoneNumberListSchema,
  })
);

const teacherFormSchema = teacherSchema.extend({
  phoneNumber: simplePhoneNumberListSchema,
});

export default class Teacher extends DataModel(teacherSchema) {
  static DB = BaseModel(teacherDBSchema);
}

const teacherEnrollSchema = externalUserSchema.merge(teacherSchema.partial());

const teacherEnrollDBSchema = externalUserSchema.merge(
  teacherDBSchema.partial()
);

export class TeacherEnroll extends ExternalUser(
  teacherEnrollSchema,
  "teachers/new"
) {
  static DB = BaseModel(teacherEnrollDBSchema);
}

export const teacherConverter = dbConverter(Teacher, teacherDBSchema);
export const teacherEnrollConverter = dbConverter(
  TeacherEnroll,
  teacherEnrollDBSchema
);

export type TeacherDB = InstanceType<typeof Teacher.DB>;
export type TeacherDBData = TeacherDB["data"];

export type TeacherEnrollDB = InstanceType<typeof TeacherEnroll.DB>;
export type TeacherEnrollDBData = TeacherEnrollDB["data"];

export type TeacherFormData = z.infer<typeof teacherFormSchema>;
