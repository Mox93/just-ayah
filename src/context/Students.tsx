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
import {
  createContext,
  FunctionComponent,
  useCallback,
  useContext,
  useState,
} from "react";

import { db } from "services/firebase";
import {
  Student,
  StudentInfo,
  StudentInDB,
  studentFromDB,
  studentFromInfo,
} from "models/student";
import { AddData, FetchData, UpdateData } from "models";
import { omit } from "utils";
import { toNoteMap } from "models/note";

interface StudentsContextObj {
  data: Student[];
  addStudent: AddData<StudentInfo>;
  fetchStudents: FetchData;
  updateStudent: UpdateData<Student>;
}

const StudentsContext = createContext<StudentsContextObj>({
  data: [],
  addStudent: omit,
  fetchStudents: omit,
  updateStudent: omit,
});

interface StudentsProviderProps {}

export const StudentsProvider: FunctionComponent<StudentsProviderProps> = ({
  children,
}) => {
  const [data, setData] = useState<Student[]>([]);
  const [lastDoc, setLastDoc] = useState<DocumentData>();
  const collectionRef = collection(db, "students");

  const addStudent: AddData<StudentInfo> = useCallback(
    (data, { onFulfilled = omit, onRejected = console.log } = {}) => {
      addDoc(collectionRef, studentFromInfo(data))
        .then(onFulfilled, onRejected)
        .catch(console.log);
    },
    [collectionRef]
  );

  const fetchStudents: FetchData = useCallback(
    ({
      filters = [],
      size = 20,
      sort = { by: "meta.dateCreated", direction: "desc" as OrderByDirection },
      callback: {
        onFulfilled: onfulfilled = omit,
        onRejected: onrejected = console.log,
      } = {},
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
    },
    [collectionRef, lastDoc]
  );

  const updateStudent: UpdateData<Student> = useCallback(
    (id, updates, { onFulfilled = omit, onRejected = console.log } = {}) => {
      const { notes, ...rest } = updates;
      const updatesDB = {
        ...rest,
        ...(notes ? { notes: toNoteMap(notes) } : {}),
      };

      updateDoc(doc(collectionRef, id), updatesDB).then(() => {
        setData((state) =>
          state.map((data) => (data.id === id ? { ...data, ...updates } : data))
        );

        onFulfilled();
      }, onRejected);
    },
    [collectionRef]
  );

  return (
    <StudentsContext.Provider
      value={{ addStudent, fetchStudents, updateStudent, data }}
    >
      {children}
    </StudentsContext.Provider>
  );
};

export const useStudents = () => useContext(StudentsContext);
