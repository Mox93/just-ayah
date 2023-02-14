import { UserRef, userRefSchema } from "./blocks/user";

interface ShortList {
  teachers?: string[];
  courses?: string[];
}

interface UserSearchFields {
  name: string;
  phoneNumber: string[];
}

interface UserIndexMap {
  [id: string]: UserSearchFields;
}

export type UserIndexList = UserRef[];

export interface MetaData {
  shortList: ShortList;
  studentIndex: UserIndexList;
  teacherIndex: UserIndexList;
}

export const META_DATA_DOCS: (keyof MetaData)[] = [
  "shortList",
  "studentIndex",
  "teacherIndex",
];

export const userIndexFromDB = (userIndex?: UserIndexMap): UserIndexList =>
  Object.entries(userIndex || {}).flatMap(([id, data]) => {
    const result = userRefSchema.safeParse({ id, ...data });

    // console.log(result, data);

    return result.success ? result.data : [];
  });
