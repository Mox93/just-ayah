import {
  addDoc,
  collection,
  doc,
  DocumentData,
  getDoc,
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

import { FetchData, GetData, UpdateData } from "models";
import { TeacherInfo, Teacher, teacherConverter } from "models/teacher";
import { db } from "services/firebase";
import { applyUpdates, debug, omit } from "utils";

const collectionRef = collection(db, "teachers");
const teacherRef = collectionRef.withConverter(teacherConverter);

interface TeacherContext {
  teachers: Teacher[];
  addTeacher: (data: TeacherInfo) => void;
  fetchTeachers: FetchData;
  getTeacher: GetData<Teacher>;
  updateTeacher: UpdateData<Teacher>;
}

const initialState: TeacherContext = {
  teachers: [],
  addTeacher: (
    data,
    {
      onFulfilled = debug((value) => console.log("FULFILLED", value)),
      onRejected = debug((value) => console.log("REJECTED", value)),
    } = {}
  ) => {
    addDoc(teacherRef, data)
      .then(onFulfilled, onRejected)
      .catch((error) => console.log("ERROR", error));
  },
  fetchTeachers: omit,
  getTeacher: async (id: string) => {
    const docRef = doc(teacherRef, id);
    const result = await getDoc(docRef);

    return result.data();
  },
  updateTeacher: omit,
};

const teacherContext = createContext<TeacherContext>(initialState);

interface TeacherProviderProps {}

export const TeacherProvider: FC<TeacherProviderProps> = ({ children }) => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [lastDoc, setLastDoc] = useState<DocumentData>();

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
        teacherRef,
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

  const updateTeacher: UpdateData<Teacher> = useCallback(
    (
      id,
      updates,
      {
        onFulfilled = debug((value) => console.log("FULFILLED", value)),
        onRejected = debug((value) => console.log("REJECTED", value)),
        applyLocally,
      } = {}
    ) => {
      // TODO we need to handle passing field paths like such "meta.course"

      const updatesDB: any = { ...updates, "meta.dateUpdated": new Date() };

      updateDoc(doc(teacherRef, id), updatesDB).then(() => {
        applyLocally &&
          setTeachers((state) =>
            state.map((data) =>
              data.id === id ? applyUpdates(data, updates) : data
            )
          );

        onFulfilled();
      }, onRejected);
    },
    []
  );

  return (
    <teacherContext.Provider
      value={{
        ...initialState,
        teachers,
        fetchTeachers,
        updateTeacher,
      }}
    >
      {children}
    </teacherContext.Provider>
  );
};

export const useTeacherContext = () => useContext(teacherContext);
