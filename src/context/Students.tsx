import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { createContext, FunctionComponent, useContext, useState } from "react";

import { db } from "../services/firebase";
import { Student, StudentInDB, Students, toStudent } from "../models/student";
import { ProviderProps } from "../models";
import { omit } from "../utils";

interface StudentsContextObj {
  data: Students;
  addStudent: (data: Student) => void;
  fetchStudents: (state?: string) => void;
  archiveStudent: (id: string) => void;
}

const StudentsContext = createContext<StudentsContextObj>({
  data: {},
  addStudent: omit,
  fetchStudents: omit,
  archiveStudent: omit,
});

interface StudentsProviderProps extends ProviderProps {}

export const StudentsProvider: FunctionComponent<StudentsProviderProps> = ({
  children,
}) => {
  const [data, setData] = useState<Students>({});
  const studentsRef = collection(db, "students");

  const addStudent = (data: Student) => {
    addDoc(studentsRef, data);
  };

  const fetchStudents = async (state?: string) => {
    const q = state
      ? query(studentsRef, where("state", "==", state))
      : studentsRef;
    const querySnapshot = await getDocs(q);
    const newData: Students = {};

    querySnapshot.docs.forEach(
      (doc) => (newData[doc.id] = toStudent(doc.data() as StudentInDB))
    );

    setData(newData);
  };

  const archiveStudent = (id: string) => {
    updateDoc(doc(studentsRef, id), { state: "archived" });
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
