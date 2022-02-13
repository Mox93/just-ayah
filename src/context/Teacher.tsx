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

import { db } from "services/firebase";
import { TeacherInfo, Teacher } from "models/teacher";
import { ProviderProps } from "models";
import { omit } from "utils";

interface TeacherContextObj {
  data: Teacher[];
  add: (data: TeacherInfo) => void;
  fetch: (state?: string) => void;
  archive: (id: string) => void;
}

const TeachersContext = createContext<TeacherContextObj>({
  data: [],
  add: omit,
  fetch: omit,
  archive: omit,
});

interface TeachersProviderProps extends ProviderProps {}

export const TeachersProvider: FunctionComponent<TeachersProviderProps> = ({
  children,
}) => {
  const [data, setData] = useState<Teacher[]>([]);
  const teachersRef = collection(db, "teachers");

  const add = (data: TeacherInfo) => {
    addDoc(teachersRef, data);
  };

  const fetch = async (state: string = "active") => {
    const q = query(teachersRef, where("meta.status", "==", state));
    const querySnapshot = await getDocs(q);
    const newData: Teacher[] = [];

    // querySnapshot.docs.forEach(
    //   (doc) => (newData[doc.id] = { ...(doc.data() as TeacherInfo) })
    // );

    setData(newData);
  };

  const archive = (id: string) => {
    updateDoc(doc(teachersRef, id), { state: "archived" });
  };

  return (
    <TeachersContext.Provider value={{ add, fetch, archive, data }}>
      {children}
    </TeachersContext.Provider>
  );
};

export const useTeachers = () => useContext(TeachersContext);
