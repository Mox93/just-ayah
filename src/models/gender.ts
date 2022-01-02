export const gender = ["male", "female"] as const;

export type Gender = typeof gender[number];
