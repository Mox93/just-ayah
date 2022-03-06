import {
  addDoc,
  collection,
  doc,
  DocumentData,
  FieldPath,
  getDocs,
  limit,
  orderBy,
  OrderByDirection,
  query,
  startAfter,
  updateDoc,
  where,
  WhereFilterOp,
} from "firebase/firestore";
import { createContext, FunctionComponent, useContext, useState } from "react";

import { db } from "services/firebase";
import {
  Student,
  StudentInfo,
  StudentInDB,
  studentFromDB,
  studentFromInfo,
} from "models/student";
import { ProviderProps } from "models";
import { omit } from "utils";

type AddStudent = (
  data: StudentInfo,
  onfulfilled?: (response: any) => void,
  onrejected?: (response: any) => void
) => void;

type FetchStudents = (options?: {
  filters?: [string, WhereFilterOp, any][];
  size?: number;
  sort?: { by: string | FieldPath; direction?: OrderByDirection };
}) => void;

interface StudentsContextObj {
  data: Student[];
  addStudent: AddStudent;
  fetchStudents: FetchStudents;
  archiveStudent: (student: Student) => void;
}

const StudentsContext = createContext<StudentsContextObj>({
  data: [],
  addStudent: omit,
  fetchStudents: omit,
  archiveStudent: omit,
});

interface StudentsProviderProps extends ProviderProps {}

export const StudentsProvider: FunctionComponent<StudentsProviderProps> = ({
  children,
}) => {
  const [data, setData] = useState<Student[]>([]);
  const [lastDoc, setLastDoc] = useState<DocumentData>();
  const studentsRef = collection(db, "students");

  const addStudent: AddStudent = (
    data,
    onfulfilled = omit,
    onrejected = console.log
  ) => {
    addDoc(studentsRef, studentFromInfo(data))
      .then(onfulfilled, onrejected)
      .catch(console.log);
  };

  const fetchStudents: FetchStudents = async ({
    filters = [],
    size = 20,
    sort = { by: "meta.dateCreated", direction: "desc" as OrderByDirection },
  } = {}) => {
    const q = query(
      studentsRef,
      ...filters.map((filter) => where(...filter)),
      limit(size),
      orderBy(sort.by, sort.direction),
      ...(lastDoc ? [startAfter(lastDoc)] : [])
    );
    const querySnapshot = await getDocs(q);

    setData((state) => {
      const newState = [...state];

      querySnapshot.docs.forEach((doc, i) => {
        newState.push(studentFromDB(doc.id, doc.data() as StudentInDB));

        if (i === size - 1) {
          setLastDoc(doc);
        }
      });

      return newState;
    });
  };

  const archiveStudent = (student: Student) => {
    updateDoc(doc(studentsRef, student.id), {
      meta: { ...student.meta, state: "archived", dateUpdated: new Date() },
    });
  };

  return (
    <StudentsContext.Provider
      value={{ addStudent, fetchStudents, archiveStudent, data }}
    >
      {children}
    </StudentsContext.Provider>
  );
};

export const useStudents = () => useContext(StudentsContext);
