import { collection, CollectionReference } from "firebase/firestore";
import { createContext, FC, useCallback, useContext, useState } from "react";

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

export const TeacherProvider: FC = ({ children }) => {
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

  const updateTeacher = useUpdateDoc({ collectionRef, setData: setTeachers });

  const addNote = useCallback<AddCommentFunc>(
    (id, note) => {
      const { dateCreated } = note;
      updateTeacher(id, {
        [`meta.notes.${dateCreated.getTime()}`]: note,
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
};

export function useTeacherContext() {
  const context = useContext(teacherContext);
  assert(context !== null);
  return context;
}
