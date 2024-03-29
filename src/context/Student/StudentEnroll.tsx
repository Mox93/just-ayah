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
import { changeDateUpdated, sealEnroll } from "models/blocks";
import {
  StudentDB,
  StudentEnroll,
  studentEnrollConverter,
  StudentEnrollDB,
} from "models/student";
import { assert } from "utils";

import { collectionRef } from "./Student";

const studentEnrollRef = collectionRef.withConverter(studentEnrollConverter);

interface StudentEnrollContext extends UseUpdateEnrollResult {
  enrolls: StudentEnroll[];
  addEnroll: AddDataFunc<StudentEnrollDB>;
  fetchEnrolls: FetchDataFunc<EnrollUser>; // this means we can only fetch using enroll fields
  getStudentEnroll: GetDataFunc<StudentEnroll>;
  deleteEnroll: DeleteDataFunc;
  submitEnroll: SetDataFunc<StudentDB>;
}

export const studentEnrollContext = createContext<StudentEnrollContext | null>(
  null
);

export function StudentEnrollProvider({ children }: PropsWithChildren) {
  const [enrolls, setEnrolls] = useState<StudentEnroll[]>([]);

  const addEnroll = useAddDoc({
    collectionRef: studentEnrollRef,
    setData: setEnrolls,
    DataClass: StudentEnroll,
  });

  const fetchEnrolls = useGetDocs<StudentEnroll, EnrollUser>({
    collectionRef: studentEnrollRef,
    setData: setEnrolls,
    fetchDefaults: {
      filters: [["enroll.awaiting", "==", true]],
      sort: { by: "enroll.dateCreated", direction: "desc" },
    },
  });

  const getStudentEnroll = useGetDoc({ collectionRef: studentEnrollRef });

  const deleteEnroll = useDeleteDoc({
    collectionRef: studentEnrollRef,
    setData: setEnrolls,
  });

  const updateStudent = useUpdateDoc({
    collectionRef,
    setData: setEnrolls,
    processUpdates: sealEnroll,
  });

  const submitEnroll = useCallback<SetDataFunc<StudentDB>>(
    (id, { data }, options) => updateStudent(id, data as any, options),
    [updateStudent]
  );

  const { refreshEnroll, updateEnrollName } = useUpdateEnroll(
    useUpdateDoc({
      collectionRef: studentEnrollRef,
      setData: setEnrolls,
      processUpdates: changeDateUpdated("enroll"),
    })
  );

  return (
    <studentEnrollContext.Provider
      value={{
        enrolls,
        fetchEnrolls,
        getStudentEnroll,
        deleteEnroll,
        addEnroll,
        submitEnroll,
        refreshEnroll,
        updateEnrollName,
      }}
    >
      {children}
    </studentEnrollContext.Provider>
  );
}

export function useStudentEnrollContext() {
  const context = useContext(studentEnrollContext);
  assert(context !== null);
  return context;
}
