import { deleteField } from "firebase/firestore";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react";

import {
  useAddDoc,
  useDeleteDoc,
  useUpdateEnroll,
  UseUpdateEnrollResult,
  useGetDocs,
  useUpdateDoc,
  EnrollUser,
  useGetDoc,
} from "hooks/Collection";
import {
  AddDataFunc,
  DeleteDataFunc,
  FetchDataFunc,
  GetDataFunc,
  SetDataFunc,
} from "models";
import {
  TeacherDB,
  TeacherEnroll,
  teacherEnrollConverter,
  TeacherEnrollDB,
} from "models/teacher";
import { assert } from "utils";

import { collectionRef } from "./Teacher";

const teacherEnrollRef = collectionRef.withConverter(teacherEnrollConverter);

interface TeacherEnrollContext extends UseUpdateEnrollResult {
  enrolls: TeacherEnroll[];
  addEnroll: AddDataFunc<TeacherEnrollDB>;
  fetchEnrolls: FetchDataFunc<EnrollUser>; // this means we can only fetch using enroll fields
  getTeacherEnroll: GetDataFunc<TeacherEnroll>;
  deleteEnroll: DeleteDataFunc;
  submitEnroll: SetDataFunc<TeacherDB>;
}

export const teacherEnrollContext = createContext<TeacherEnrollContext | null>(
  null
);

export function TeacherEnrollProvider({ children }: PropsWithChildren) {
  const [enrolls, setEnrolls] = useState<TeacherEnroll[]>([]);

  const addEnroll = useAddDoc({
    collectionRef: teacherEnrollRef,
    setData: setEnrolls,
    DataClass: TeacherEnroll,
  });

  const fetchEnrolls = useGetDocs({
    collectionRef: teacherEnrollRef,
    setData: setEnrolls,
    fetchDefaults: { sort: { by: "enroll.dateCreated", direction: "desc" } },
  });

  const getTeacherEnroll = useGetDoc({ collectionRef: teacherEnrollRef });

  const deleteEnroll = useDeleteDoc({
    collectionRef: teacherEnrollRef,
    setData: setEnrolls,
  });

  const updateTeacher = useUpdateDoc({ collectionRef, setData: setEnrolls });

  const submitEnroll = useCallback<SetDataFunc<TeacherDB>>(
    (id, { data }, options) => {
      Object.assign(data, { enroll: deleteField() });
      // data.meta.notes is incompatible because UpdateData<TeacherDB> injects FieldValue inside of {[x: string]: Comment}
      updateTeacher(id, data as any, options);
    },
    [updateTeacher]
  );

  const { refreshEnroll, updateEnrollName } = useUpdateEnroll(
    useUpdateDoc({
      collectionRef: teacherEnrollRef,
      setData: setEnrolls,
    })
  );

  return (
    <teacherEnrollContext.Provider
      value={{
        enrolls,
        fetchEnrolls,
        getTeacherEnroll,
        deleteEnroll,
        addEnroll,
        submitEnroll,
        refreshEnroll,
        updateEnrollName,
      }}
    >
      {children}
    </teacherEnrollContext.Provider>
  );
}

export function useTeacherEnrollContext() {
  const context = useContext(teacherEnrollContext);
  assert(context !== null);
  return context;
}
