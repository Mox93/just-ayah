import { pluck } from "utils";
import { z } from "zod";

import { trackableSchema } from "./trackable";
import { userSchema } from "./user";

const _commentSchema = trackableSchema.merge(
  z.object({
    body: z.string(),
    createdBy: userSchema.optional(),
  })
);

export type Comment = z.infer<typeof _commentSchema>;

export const commentSchema = trackableSchema
  .merge(_commentSchema)
  .merge(
    z.object({
      user: userSchema.nullable(),
    })
  )
  .transform(({ createdBy, user, ...rest }) => {
    return _commentSchema.parse({
      ...rest,
      ...(createdBy?.email
        ? { createdBy }
        : user?.email
        ? { createdBy: user }
        : {}),
    });
  });

const commentsSchema = z.union([
  z.record(z.string(), commentSchema),
  z.array(commentSchema),
]);

export const commentListSchema = commentsSchema.transform<Comment[]>((value) =>
  Array.isArray(value)
    ? value
    : Object.entries(value)
        .sort(([a], [b]) => Number(b) - Number(a))
        .map(pluck("1"))
);

export const commentMapSchema = commentsSchema.transform((value) =>
  Array.isArray(value)
    ? value.reduce(
        (obj, comment) => ({
          ...obj,
          [`${comment.dateCreated.getTime()}`]: comment,
        }),
        {}
      )
    : value
);
