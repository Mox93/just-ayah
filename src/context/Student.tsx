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
import { StudentIndex } from "models/metaData";
import { toNoteMap } from "models/note";
import { omit } from "utils";

import { useMetaContext } from "./Meta";

const collectionRef = collection(db, "students");

interface StudentContext {
  data: { students: Student[]; studentIndex: StudentIndex };
  add: AddData<StudentInfo>;
  fetch: FetchData;
  update: UpdateData<Student>;
  get: (id: string) => void;
}

const initialState: StudentContext = {
  data: { students: [], studentIndex: [] },
  add: (data, { onFulfilled = omit, onRejected = console.log } = {}) => {
    addDoc(collectionRef, studentFromInfo(data))
      .then(onFulfilled, onRejected)
      .catch(console.log);
  },
  fetch: omit,
  update: omit,
  get: omit,
};

const studentContext = createContext(initialState);

interface StudentProviderProps {}

export const StudentProvider: FunctionComponent<StudentProviderProps> = ({
  children,
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [lastDoc, setLastDoc] = useState<DocumentData>();
  const {
    data: { studentIndex },
  } = useMetaContext();

  const get = (id: string) => {
    const docRef = doc(collectionRef, id);

    getDoc(docRef).then((doc) => doc.exists() && console.log(doc.data()));
  };

  const fetch: FetchData = useCallback(
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
        setStudents((state) => {
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
    [lastDoc]
  );

  const update: UpdateData<Student> = useCallback(
    (id, updates, { onFulfilled = omit, onRejected = console.log } = {}) => {
      const { notes, ...rest } = updates;
      const updatesDB = {
        ...rest,
        ...(notes && { notes: toNoteMap(notes) }),
      };

      updateDoc(doc(collectionRef, id), updatesDB).then(() => {
        setStudents((state) =>
          state.map((data) => (data.id === id ? { ...data, ...updates } : data))
        );

        onFulfilled();
      }, onRejected);
    },
    []
  );

  return (
    <studentContext.Provider
      value={{
        ...initialState,
        fetch,
        update,
        get,
        data: { students, studentIndex },
      }}
    >
      {children}
    </studentContext.Provider>
  );
};

export const useStudentContext = () => useContext(studentContext);
