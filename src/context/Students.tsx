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
import { Student, Students } from "../models/student";
import { ProviderProps } from "../models";
import { omit } from "../utils";

interface StudentsContextObj {
  data: Students;
  add: (data: Student) => void;
  fetch: (state?: string) => void;
  archive: (id: string) => void;
}

const StudentsContext = createContext<StudentsContextObj>({
  data: {},
  add: omit,
  fetch: omit,
  archive: omit,
});

interface StudentsProviderProps extends ProviderProps {}

export const StudentsProvider: FunctionComponent<StudentsProviderProps> = ({
  children,
}) => {
  const [data, setData] = useState<Students>({});
  const studentsRef = collection(db, "students");

  const add = (data: Student) => {
    console.log("ADDING");

    addDoc(studentsRef, data).then((res) => console.log(res));
  };

  const fetch = async (state: string = "active") => {
    const q = query(studentsRef, where("state", "==", state));
    const querySnapshot = await getDocs(q);
    const newData: Students = {};

    querySnapshot.docs.forEach(
      (doc) => (newData[doc.id] = { ...(doc.data() as Student) })
    );

    setData(newData);
  };

  const archive = (id: string) => {
    updateDoc(doc(studentsRef, id), { state: "archived" });
  };

  return (
    <StudentsContext.Provider value={{ add, fetch, archive, data }}>
      {children}
    </StudentsContext.Provider>
  );
};

export const useStudents = () => useContext(StudentsContext);
