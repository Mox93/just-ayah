import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { createContext, FunctionComponent, useContext, useState } from "react";

import { db } from "../services/firebase";
import {
  Student,
  StudentInfo,
  StudentInDB,
  studentFromDB,
  studentFromInfo,
} from "../models/student";
import { ProviderProps } from "../models";
import { omit } from "../utils";

interface StudentsContextObj {
  data: Student[];
  addStudent: (data: StudentInfo) => void;
  fetchStudents: (state?: string) => void;
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

  const addStudent = (data: StudentInfo) => {
    addDoc(studentsRef, studentFromInfo(data));
  };

  const fetchStudents = async (state?: string) => {
    const q = state
      ? query(studentsRef, where("meta.state", "==", state), limit(20))
      : studentsRef;
    const querySnapshot = await getDocs(q);
    const newData: Student[] = [];

    querySnapshot.docs.forEach((doc) =>
      newData.push(studentFromDB(doc.id, doc.data() as StudentInDB))
    );

    setData(newData);
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
