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
  Object.entries(studentIndex || {}).map(([id, data]) => ({
    id,
    ...data,
  }));
