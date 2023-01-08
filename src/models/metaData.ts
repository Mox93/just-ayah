import { getCountry } from "./blocks";

interface ShortList {
  teachers?: string[];
  courses?: string[];
}

interface StudentSearchFields {
  name: string;
  phoneNumber: string[];
}

interface PersonIndexInDB {
  [id: string]: StudentSearchFields;
}

export type PersonIndex = (StudentSearchFields & {
  id: string;
})[];

export interface MetaDataInDB {
  shortList?: ShortList;
  studentIndex?: PersonIndexInDB;
  teacherIndex?: PersonIndexInDB;
}

export interface MetaData {
  shortList: ShortList;
  studentIndex: PersonIndex;
  teacherIndex: PersonIndex;
}

export const metaDataDocs: (keyof MetaData)[] = ["shortList", "studentIndex"];

export const personIndexFromDB = (
  studentIndex?: PersonIndexInDB
): PersonIndex =>
  Object.entries(studentIndex || {}).map(([id, { phoneNumber, ...data }]) => ({
    id,
    phoneNumber: phoneNumber.map((value) => {
      const [code, ...number] = value.split("-", 1);
      return [getCountry(code as any)?.phone ?? code, ...number].join("");
    }),
    ...data,
  }));
