import { z } from "zod";

import { dbConverter } from "utils";

import { BaseModel, DataModel } from "./abstract";
import { indexList, indexMap, trackableSchema } from "./blocks";

const _courseSchema = z.object({
  name: z.string(),
  sessionCount: z.number().int().positive(),
});

export const courseSchema = _courseSchema.extend({
  meta: trackableSchema.default({}),
});

export const courseIndexSchema = _courseSchema.extend({ id: z.string() });

export type CourseIndex = z.infer<typeof courseIndexSchema>;

const courseIndexesSchema = z.union([
  z.array(courseIndexSchema),
  z.record(z.string(), _courseSchema),
]);

export const courseIndexListSchema = indexList(courseIndexesSchema);

export const courseIndexMapSchema = indexMap(courseIndexesSchema);

export class Course extends DataModel(courseSchema) {
  static DB = BaseModel(courseSchema);
}

export const courseConverter = dbConverter(Course, courseSchema);

export type CourseDB = InstanceType<typeof Course.DB>;
export type CourseDBData = CourseDB["data"];

export type CourseFormData = CourseDBData;
