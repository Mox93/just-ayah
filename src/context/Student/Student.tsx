import { collection, CollectionReference } from "firebase/firestore";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react";

import {
  useAddDoc,
  useGetDoc,
  useGetDocs,
  useUpdateDoc,
} from "hooks/Collection";
import {
  AddCommentFunc,
  AddDataFunc,
  GetDataFunc,
  FetchDataFunc,
  UpdateDataFunc,
} from "models";
import { changeDateUpdated } from "models/blocks";
import Student, {
  studentConverter,
  StudentDB,
  StudentDBData,
} from "models/student";
import { assert } from "utils";
import { db } from "services/firebase";

const COLLECTION_NAME = "students";

export const collectionRef = collection(
  db,
  COLLECTION_NAME
) as CollectionReference<StudentDBData>;
const studentRef = collectionRef.withConverter(studentConverter);

interface StudentContext {
  students: Student[];
  addStudent: AddDataFunc<StudentDB>;
  fetchStudents: FetchDataFunc<StudentDBData>;
  updateStudent: UpdateDataFunc<StudentDBData>;
  getStudent: GetDataFunc<Student>;
  addNote: AddCommentFunc;
}

const studentContext = createContext<StudentContext | null>(null);

export function StudentProvider({ children }: PropsWithChildren) {
  const [students, setStudents] = useState<Student[]>([]);

  const addStudent = useAddDoc({
    collectionRef: studentRef,
    setData: setStudents,
    DataClass: Student,
  });

  const fetchStudents = useGetDocs<Student, StudentDBData>({
    collectionRef: studentRef,
    setData: setStudents,
    fetchDefaults: { sort: { by: "meta.dateCreated", direction: "desc" } },
  });

  const getStudent = useGetDoc({ collectionRef: studentRef });

  const updateStudent = useUpdateDoc({
    collectionRef,
    setData: setStudents,
    processUpdates: changeDateUpdated("meta"),
  });

  const addNote = useCallback<AddCommentFunc>(
    (id, note) => {
      const { dateCreated } = note;
      updateStudent(
        id,
        { [`meta.notes.${dateCreated.getTime()}`]: note },
        { applyLocally: true }
      );
    },
    [updateStudent]
  );

  return (
    <studentContext.Provider
      value={{
        students,
        addStudent,
        fetchStudents,
        getStudent,
        updateStudent,
        addNote,
      }}
    >
      {children}
    </studentContext.Provider>
  );
}

export function useStudentContext() {
  const context = useContext(studentContext);
  assert(context !== null);
  return context;
}
