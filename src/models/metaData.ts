export interface ShortList {
  teachers?: string[];
  courses?: string[];
}

export interface StudentSearchFields {
  id: string;
  name: string;
  phoneNumber: string[];
}

export interface StudentIndex {
  index: StudentSearchFields[];
}

export interface MetaData {
  shortList?: ShortList;
  studentIndex?: StudentIndex;
}

export const metaDataDocs: (keyof MetaData)[] = ["shortList", "studentIndex"];
