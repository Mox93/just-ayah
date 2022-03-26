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
import { toNoteMap } from "models/note";

type AddStudent = (
  data: StudentInfo,
  callback?: {
    onfulfilled?: (response: any) => void;
    onrejected?: (response: any) => void;
  }
) => void;

type FetchStudents = (options?: {
  filters?: [string, WhereFilterOp, any][];
  size?: number;
  sort?: { by: string | FieldPath; direction?: OrderByDirection };
  callback?: {
    onfulfilled?: (response: any) => void;
    onrejected?: (response: any) => void;
  };
}) => void;

type UpdateStudent = (
  id: string,
  updates: Partial<Student>,
  callback?: {
    onfulfilled?: () => void;
    onrejected?: (response: any) => void;
  }
) => void;

interface StudentsContextObj {
  data: Student[];
  addStudent: AddStudent;
  fetchStudents: FetchStudents;
  updateStudent: UpdateStudent;
}

const StudentsContext = createContext<StudentsContextObj>({
  data: [],
  addStudent: omit,
  fetchStudents: omit,
  updateStudent: omit,
});

interface StudentsProviderProps extends ProviderProps {}

export const StudentsProvider: FunctionComponent<StudentsProviderProps> = ({
  children,
}) => {
  const [data, setData] = useState<Student[]>([]);
  const [lastDoc, setLastDoc] = useState<DocumentData>();
  const collectionRef = collection(db, "students");

  const addStudent: AddStudent = (
    data,
    { onfulfilled = omit, onrejected = console.log } = {}
  ) => {
    addDoc(collectionRef, studentFromInfo(data))
      .then(onfulfilled, onrejected)
      .catch(console.log);
  };

  const fetchStudents: FetchStudents = ({
    filters = [],
    size = 20,
    sort = { by: "meta.dateCreated", direction: "desc" as OrderByDirection },
    callback: { onfulfilled = omit, onrejected = console.log } = {},
  } = {}) => {
    const q = query(
      collectionRef,
      ...filters.map((filter) => where(...filter)),
      limit(size),
      orderBy(sort.by, sort.direction),
      ...(lastDoc ? [startAfter(lastDoc)] : [])
    );

    getDocs(q).then((querySnapshot) => {
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

      onfulfilled(querySnapshot);
    }, onrejected);
  };

  const updateStudent: UpdateStudent = (
    id,
    updates,
    { onfulfilled = omit, onrejected = console.log } = {}
  ) => {
    const { notes, ...rest } = updates;
    const updatesDB = {
      ...rest,
      ...(notes ? { notes: toNoteMap(notes) } : {}),
    };

    updateDoc(doc(collectionRef, id), updatesDB).then(() => {
      setData((state) =>
        state.map((data) => (data.id === id ? { ...data, ...updates } : data))
      );

      onfulfilled();
    }, onrejected);
  };

  return (
    <StudentsContext.Provider
      value={{ addStudent, fetchStudents, updateStudent, data }}
    >
      {children}
    </StudentsContext.Provider>
  );
};

export const useStudents = () => useContext(StudentsContext);
