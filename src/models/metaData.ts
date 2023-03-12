import { UserIndex, userIndexSchema } from "./blocks/user";

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

export type UserIndexList = UserIndex[];

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
