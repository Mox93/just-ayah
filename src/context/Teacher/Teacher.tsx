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
import Teacher, {
  teacherConverter,
  TeacherDB,
  TeacherDBData,
} from "models/teacher";
import { assert } from "utils";
import { db } from "services/firebase";

const COLLECTION_NAME = "teachers";

export const collectionRef = collection(
  db,
  COLLECTION_NAME
) as CollectionReference<TeacherDBData>;
const teacherRef = collectionRef.withConverter(teacherConverter);

interface TeacherContext {
  teachers: Teacher[];
  addTeacher: AddDataFunc<TeacherDB>;
  fetchTeachers: FetchDataFunc<TeacherDBData>;
  updateTeacher: UpdateDataFunc<TeacherDBData>;
  getTeacher: GetDataFunc<Teacher>;
  addNote: AddCommentFunc;
}

const teacherContext = createContext<TeacherContext | null>(null);

export function TeacherProvider({ children }: PropsWithChildren) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const addTeacher = useAddDoc({
    collectionRef: teacherRef,
    setData: setTeachers,
    DataClass: Teacher,
  });

  const fetchTeachers = useGetDocs<Teacher, TeacherDBData>({
    collectionRef: teacherRef,
    setData: setTeachers,
    fetchDefaults: { sort: { by: "meta.dateCreated", direction: "desc" } },
  });

  const getTeacher = useGetDoc({ collectionRef: teacherRef });

  const updateTeacher = useUpdateDoc({
    collectionRef,
    setData: setTeachers,
    processUpdates: changeDateUpdated("meta"),
  });

  const addNote = useCallback<AddCommentFunc>(
    (id, note) => {
      const { dateCreated } = note;
      updateTeacher(id, {
        // HACK: TS is unable to identify this key as `meta.notes.${string}`
        [`meta.notes.${dateCreated.getTime()}` as any]: note,
      });
    },
    [updateTeacher]
  );

  return (
    <teacherContext.Provider
      value={{
        teachers,
        addTeacher,
        fetchTeachers,
        getTeacher,
        updateTeacher,
        addNote,
      }}
    >
      {children}
    </teacherContext.Provider>
  );
}

export function useTeacherContext() {
  const context = useContext(teacherContext);
  assert(context !== null);
  return context;
}
