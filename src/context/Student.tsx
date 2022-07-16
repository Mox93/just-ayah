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
import { Student, StudentInfo, studentConverter } from "models/student";
import { AddComment, AddData, GetData, LoadData, UpdateData } from "models";
import { toCommentMap } from "models/comment";
import { applyUpdates, debug, omit } from "utils";

const collectionRef = collection(db, "students");
const studentRef = collectionRef.withConverter(studentConverter);

interface StudentContext {
  data: { students: Student[] };
  addStudent: AddData<StudentInfo>;
  loadStudents: LoadData;
  updateStudent: UpdateData<Student>;
  getStudent: GetData<Student>;
  generateLink: () => Promise<string>;
  addNote: AddComment;
}

const initialState: StudentContext = {
  data: { students: [] },
  addStudent: (
    data,
    { onFulfilled = debug("FULFILLED"), onRejected = debug("REJECTED") } = {}
  ) => {
    addDoc(studentRef, data)
      .then(onFulfilled, onRejected)
      .catch((error) => console.log("ERROR", error));
  },
  loadStudents: omit,
  updateStudent: omit,
  getStudent: async (id: string) => {
    const docRef = doc(studentRef, id);
    const result = await getDoc(docRef);

    return result.data();
  },
  generateLink: async () => {
    const data = {
      awaitEnroll: true,
      openedAt: new Date(),
    };

    const result = await addDoc(collectionRef, data);

    return `${window.location.protocol}//${window.location.host}/enroll/${result.id}`;
  },
  addNote: omit,
};

const studentContext = createContext(initialState);

interface StudentProviderProps {}

export const StudentProvider: FunctionComponent<StudentProviderProps> = ({
  children,
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [lastDoc, setLastDoc] = useState<DocumentData>();

  const loadStudents: LoadData = useCallback(
    ({
      filters = [],
      size = 20,
      sort = { by: "meta.dateCreated", direction: "desc" as OrderByDirection },
      options: {
        onFulfilled = debug("FULFILLED"),
        onRejected = debug("REJECTED"),
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
        .catch(debug("ERROR"));
    },
    [lastDoc]
  );

  const updateStudent: UpdateData<Student> = useCallback(
    (
      id,
      updates,
      {
        onFulfilled = debug("FULFILLED"),
        onRejected = debug("REJECTED"),
        applyLocally,
      } = {}
    ) => {
      // TODO we need to handle passing field paths like such "meta.course"

      const { meta, "meta.notes": metaNotes, ...rest } = updates;
      const { notes } = meta || {};

      const updatesDB = {
        // : UpdateObject<Student> = {
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

      updateDoc(doc(studentRef, id), updatesDB as any).then(() => {
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
        loadStudents,
        updateStudent,
        addNote,
        data: { students },
      }}
    >
      {children}
    </studentContext.Provider>
  );
};

export const useStudentContext = () => useContext(studentContext);
