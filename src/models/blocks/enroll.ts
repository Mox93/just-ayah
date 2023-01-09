import { z } from "zod";

import { AddData, DeleteData, FetchData } from "models";
import { assert, omit } from "utils";

import { booleanSchema } from "./boolean";
import { trackableSchema } from "./trackable";
import { dateSchema, shiftDate } from "./dateTime";

const newEnrollSchema = z.object({
  name: z.string().optional(),
  duration: z.number().int().default(48),
});

const _enrollSchema = trackableSchema.merge(
  z.object({
    name: z.string().optional(),
    awaiting: booleanSchema,
    expiresAt: dateSchema,
  })
);

export type _Enroll = z.infer<typeof _enrollSchema>;

function isEnroll(value: any): value is _Enroll {
  return ["awaiting", "expiresAt"].every((key) => Object.hasOwn(value, key));
}

const enrollMethods = {
  renew(duration?: number) {
    assert(isEnroll(this));
    const { name } = this;
    return enrollSchema.parse({ name, duration });
  },
} as const;

export type Enroll = _Enroll & typeof enrollMethods;

export const enrollSchema = z
  .union([
    _enrollSchema,
    newEnrollSchema.transform(({ duration, ...value }) =>
      _enrollSchema.parse({
        ...value,
        awaiting: true,
        expiresAt: shiftDate(new Date(), { hour: duration }),
      })
    ),
  ])
  .transform<Enroll>((value) =>
    Object.assign(Object.create(enrollMethods), value)
  );

interface EnrollUser {
  enroll: Enroll;
}

export interface EnrollContext<T extends EnrollUser = EnrollUser> {
  enrolls: T[];
  addEnroll: AddData<Enroll>;
  fetchEnrolls: FetchData<T>;
  refreshEnroll: (id: string, duration?: number) => void;
  updateEnrollName: (id: string, name: string) => void;
  deleteEnroll: DeleteData;
  submitEnroll: AddData<EnrollUser>;
}

export const enrollHookPlaceholder: EnrollContext = {
  enrolls: [],
  addEnroll: omit,
  fetchEnrolls: omit,
  refreshEnroll: omit,
  updateEnrollName: omit,
  deleteEnroll: omit,
  submitEnroll: omit,
};
