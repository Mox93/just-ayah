import { getCountry } from "./country";

interface ShortList {
  teachers?: string[];
  courses?: string[];
}

interface StudentSearchFields {
  name: string;
  phoneNumber: string[];
}

interface StudentIndexInDB {
  [id: string]: StudentSearchFields;
}

export type StudentIndex = (StudentSearchFields & {
  id: string;
})[];

export interface MetaDataInDB {
  shortList?: ShortList;
  studentIndex?: StudentIndexInDB;
}

export interface MetaData {
  shortList: ShortList;
  studentIndex: StudentIndex;
}

export const metaDataDocs: (keyof MetaData)[] = ["shortList", "studentIndex"];

export const studentIndexFromDB = (
  studentIndex?: StudentIndexInDB
): StudentIndex =>
  Object.entries(studentIndex || {}).map(([id, { phoneNumber, ...data }]) => ({
    id,
    phoneNumber: phoneNumber.map((value) => {
      const [code, ...number] = value.split("-", 1);
      return [getCountry(code as any)?.phone ?? code, ...number].join("");
    }),
    ...data,
  }));
