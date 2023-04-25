import { z } from "zod";

import { trackableSchema } from "./trackable";
import { userSchema } from "../blocks/user";

const _commentSchema = trackableSchema.merge(
  z.object({
    body: z.string(),
    createdBy: userSchema.optional(),
  })
);

export type Comment = z.infer<typeof _commentSchema>;

export const commentSchema = _commentSchema
  .extend({
    user: userSchema.nullable().optional(),
  })
  .transform(({ createdBy, user, ...rest }) => {
    return _commentSchema.parse({
      ...rest,
      ...(createdBy?.email && createdBy.uid
        ? { createdBy }
        : user?.email && user.uid
        ? { createdBy: user }
        : {}),
    });
  });

const commentsSchema = z.union([
  z.array(commentSchema),
  z.record(z.string(), commentSchema),
]);

export const commentListSchema = commentsSchema.transform((value) =>
  Array.isArray(value)
    ? value
    : Object.entries(value)
        .sort(([a], [b]) => Number(b) - Number(a))
        .map(([, value]) => value)
);

export const commentMapSchema = commentsSchema.transform((value) =>
  Array.isArray(value)
    ? value.reduce((obj, comment) => {
        obj[`${comment.dateCreated.getTime()}`] = comment;
        return obj;
      }, {} as Record<string, Comment>)
    : value
);
