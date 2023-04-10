import { userIndexMapSchema } from "./blocks/user";
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
  countryCodeSchema,
  countrySchema,
  genderSchema,
  phoneNumberListSchema,
  scheduleSchema,
  simplePhoneNumberListSchema,
  timezoneCodeSchema,
  timezoneSchema,
  trackableSchema,
  userIndexListSchema,
} from "./blocks";
import { dateSchema } from "./blocks";

const metaSchema = trackableSchema.merge(
  z
    .object({
      schedule: scheduleSchema,
      dailyHours: z.number().positive(),
      students: userIndexListSchema,
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

const metaDBSchema = metaSchema
  .extend({
    notes: commentMapSchema.optional(),
    students: userIndexMapSchema,
  })
  .partial();

const teacherSchema = z.object({
  firstName: z.string(),
  middleName: z.string(),
  lastName: z.string(),
  gender: genderSchema,
  governorate: z.string().optional(),
  email: z.union([z.string().email().optional(), z.literal("")]), // FIXME empty fields come from form as empty strings not undefined;
  facebook: z.union([z.string().url().optional(), z.literal("")]), // FIXME empty fields come from form as empty strings not undefined;
  dateOfBirth: dateSchema.optional(), // TODO make required once all data is valid in the DB
  nationality: countrySchema.optional(), // TODO make required once all data is valid in the DB
  country: countrySchema.optional(), // TODO make required once all data is valid in the DB
  nationalID: z.string().optional(),
  timezone: timezoneSchema.optional(),
  phoneNumber: phoneNumberListSchema,
  meta: metaSchema.default({}),
});

const simpleFields = {
  phoneNumber: simplePhoneNumberListSchema,
  nationality: countryCodeSchema.optional(), // TODO make required once all data is valid in the DB
  country: countryCodeSchema.optional(), // TODO make required once all data is valid in the DB
  timezone: timezoneCodeSchema.optional(),
};

const teacherDBSchema = teacherSchema.extend({
  ...simpleFields,
  meta: metaDBSchema.default({}),
});

const teacherFormSchema = teacherSchema.extend(simpleFields);

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

/*****************\
|*** META DATA ***|
\*****************/

export const teacherMetaSchema = z.object({
  termsUrl: z.string().array(),
});
