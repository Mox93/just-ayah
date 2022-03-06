import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
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
  } = {}) => {
    const q = query(
      studentsRef,
      ...filters.map((filter) => where(...filter)),
      limit(size),
      ...(data.length ? [startAfter(data[data.length - 1])] : [])
    );
    const querySnapshot = await getDocs(q);

    setData((state) => {
      const newState = [...state];

      querySnapshot.docs.forEach((doc) =>
        newState.push(studentFromDB(doc.id, doc.data() as StudentInDB))
      );

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
