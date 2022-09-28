import {
  addDoc,
  collection,
  doc,
  DocumentData,
  getDocs,
  limit,
  orderBy,
  OrderByDirection,
  query,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";
import { createContext, FC, useCallback, useContext, useState } from "react";

import { FetchData } from "models";
import { TeacherInfo, Teacher } from "models/teacher";
import { db } from "services/firebase";
import { debug, omit } from "utils";

import { useMetaContext } from ".";

const teachersRef = collection(db, "teachers");

interface TeacherContext {
  data: { teachers: Teacher[]; teacherList: string[] };
  add: (data: TeacherInfo) => void;
  fetchTeachers: FetchData;
  archive: (id: string) => void;
}

const teacherContext = createContext<TeacherContext>({
  data: { teachers: [], teacherList: [] },
  add: omit,
  fetchTeachers: omit,
  archive: omit,
});

interface TeacherProviderProps {}

export const TeacherProvider: FC<TeacherProviderProps> = ({ children }) => {
  const {
    data: { shortList: { teachers: teacherList = [] } = {} },
  } = useMetaContext();

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [lastDoc, setLastDoc] = useState<DocumentData>();

  const add = (data: TeacherInfo) => {
    addDoc(teachersRef, data);
  };

  const fetchTeachers: FetchData = useCallback(
    ({
      filters = [],
      size = 20,
      sort = { by: "meta.dateCreated", direction: "desc" as OrderByDirection },
      options: {
        onFulfilled = debug((value) => console.log("FULFILLED", value)),
        onRejected = debug((value) => console.log("REJECTED", value)),
      } = {},
    } = {}) => {
      const q = query(
        teachersRef,
        ...filters.map((filter) => where(...filter)),
        limit(size),
        orderBy(sort.by, sort.direction),
        ...(lastDoc ? [startAfter(lastDoc)] : [])
      );

      getDocs(q)
        .then((querySnapshot) => {
          setTeachers((state) => {
            const newState = [...state];

            querySnapshot.docs.forEach((doc, i) => {
              newState.push(doc.data() as Teacher);

              if (i + 1 === querySnapshot.size) {
                setLastDoc(doc);
              }
            });

            return newState;
          });

          onFulfilled(querySnapshot);
        }, onRejected)
        .catch(debug((value) => console.log("ERROR", value)));
    },
    [lastDoc]
  );

  const archive = (id: string) => {
    updateDoc(doc(teachersRef, id), { state: "archived" });
  };

  return (
    <teacherContext.Provider
      value={{ add, fetchTeachers, archive, data: { teachers, teacherList } }}
    >
      {children}
    </teacherContext.Provider>
  );
};

export const useTeacherContext = () => useContext(teacherContext);
