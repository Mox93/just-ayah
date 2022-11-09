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

import { db } from "services/firebase";
import { Student, StudentInfo, studentConverter } from "models/student";
import { AddComment, AddData, GetData, FetchData, UpdateData } from "models";
import { toCommentMap } from "models/comment";
import { applyUpdates, devOnly, omit } from "utils";

const collectionRef = collection(db, "students");
const studentRef = collectionRef.withConverter(studentConverter);

interface StudentContext {
  students: Student[];
  addStudent: AddData<StudentInfo>;
  fetchStudents: FetchData;
  updateStudent: UpdateData<Student>;
  getStudent: GetData<Student>;
  addNote: AddComment;
}

const initialState: StudentContext = {
  students: [],
  addStudent: (
    data,
    {
      onFulfilled = devOnly((value) => console.log("FULFILLED", value)),
      onRejected = devOnly((value) => console.log("REJECTED", value)),
    } = {}
  ) => {
    addDoc(studentRef, data as any)
      .then(onFulfilled, onRejected)
      .catch((error) => console.log("ERROR", error));
  },
  fetchStudents: omit,
  updateStudent: omit,
  getStudent: async (id: string) => {
    const docRef = doc(studentRef, id);
    const result = await getDoc(docRef);

    return result.data();
  },
  addNote: omit,
};

const studentContext = createContext(initialState);

interface StudentProviderProps {}

export const StudentProvider: FC<StudentProviderProps> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [lastDoc, setLastDoc] = useState<DocumentData>();

  const fetchStudents: FetchData = useCallback(
    ({
      filters = [],
      size = 20,
      sort = { by: "meta.dateCreated", direction: "desc" as OrderByDirection },
      options: {
        onFulfilled = devOnly((value) => console.log("FULFILLED", value)),
        onRejected = devOnly((value) => console.log("REJECTED", value)),
      } = {},
    } = {}) => {
      const q = query(
        studentRef,
        ...filters.map((filter) => where(...filter)),
        limit(size),
        orderBy(sort.by, sort.direction),
        ...(lastDoc ? [startAfter(lastDoc)] : [])
      );

      getDocs(q)
        .then((querySnapshot) => {
          setStudents((state) => {
            const newState = [...state];

            querySnapshot.docs.forEach((doc, i) => {
              newState.push(doc.data());

              if (i + 1 === querySnapshot.size) {
                setLastDoc(doc);
              }
            });

            return newState;
          });

          onFulfilled(querySnapshot);
        }, onRejected)
        .catch(devOnly((value) => console.log("ERROR", value)));
    },
    [lastDoc]
  );

  const updateStudent: UpdateData<Student> = useCallback(
    (
      id,
      updates,
      {
        onFulfilled = devOnly((value) => console.log("FULFILLED", value)),
        onRejected = devOnly((value) => console.log("REJECTED", value)),
        applyLocally,
      } = {}
    ) => {
      // TODO we need to handle passing field paths like such "meta.course"

      const { meta, "meta.notes": metaNotes, ...rest } = updates;
      const { notes } = meta || {};

      const updatesDB: any = {
        ...rest,
        ...(meta && {
          meta: {
            ...meta,
            ...(notes && { notes: toCommentMap(notes) }),
          },
        }),
        ...(metaNotes && { "meta.notes": toCommentMap(metaNotes) }),
        "meta.dateUpdated": new Date(),
      };

      updateDoc(doc(studentRef, id), updatesDB).then(() => {
        applyLocally &&
          setStudents((state) =>
            state.map((data) =>
              data.id === id ? applyUpdates(data, updates) : data
            )
          );

        onFulfilled();
      }, onRejected);
    },
    []
  );

  const addNote: AddComment = (id, { dateCreated, ...note }) => {
    const path = `meta.notes.${dateCreated.getTime()}`;
    updateStudent(id, { [path]: note } as any);

    setStudents((state) =>
      state.map((data) =>
        data.id === id
          ? {
              ...data,
              meta: {
                ...data.meta,
                notes: [{ ...note, dateCreated }, ...(data.meta.notes || [])],
              },
            }
          : data
      )
    );
    console.log({ [path]: note });
  };

  return (
    <studentContext.Provider
      value={{
        ...initialState,
        fetchStudents,
        updateStudent,
        addNote,
        students,
      }}
    >
      {children}
    </studentContext.Provider>
  );
};

export const useStudentContext = () => useContext(studentContext);
