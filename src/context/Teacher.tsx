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

import { TeacherInfo, Teacher } from "models/teacher";
import { db } from "services/firebase";
import { omit } from "utils";

import { useMetaContext } from ".";

interface TeacherContext {
  data: { teachers: Teacher[]; teacherList: string[] };
  add: (data: TeacherInfo) => void;
  fetch: (state?: string) => void;
  archive: (id: string) => void;
}

const teacherContext = createContext<TeacherContext>({
  data: { teachers: [], teacherList: [] },
  add: omit,
  fetch: omit,
  archive: omit,
});

interface TeacherProviderProps {}

export const TeacherProvider: FunctionComponent<TeacherProviderProps> = ({
  children,
}) => {
  const {
    data: { shortList: { teachers: teacherList = [] } = {} },
  } = useMetaContext();

  const [teachers, setTeachers] = useState<Teacher[]>([]);
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

    setTeachers(newData);
  };

  const archive = (id: string) => {
    updateDoc(doc(teachersRef, id), { state: "archived" });
  };

  return (
    <teacherContext.Provider
      value={{ add, fetch, archive, data: { teachers, teacherList } }}
    >
      {children}
    </teacherContext.Provider>
  );
};

export const useTeacherContext = () => useContext(teacherContext);
