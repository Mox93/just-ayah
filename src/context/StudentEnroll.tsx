import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  updateDoc,
} from "firebase/firestore";
import { createContext, FC, useCallback, useContext, useState } from "react";

import { FetchData } from "models";
import {
  studentEnrollConverter,
  EnrollInfo,
  StudentEnroll,
  studentEnrollFromInfo,
} from "models/studentEnroll";
import { db } from "services/firebase";
import { applyUpdates, debug, omit } from "utils";
import { shiftDate } from "models/dateTime";

const collectionRef = collection(db, "students");
const enrollRef = collectionRef.withConverter(studentEnrollConverter);

interface StudentEnrollContext {
  enrolls: StudentEnroll[];
  addEnroll: (enroll?: EnrollInfo) => void;
  fetchEnrolls: FetchData;
  refreshEnroll: (id: string, duration?: number) => void;
  updateEnrollKey: (id: string, key: string) => void;
  deleteEnroll: (id: string) => void;
}

const initialState: StudentEnrollContext = {
  enrolls: [],
  addEnroll: omit,
  fetchEnrolls: omit,
  refreshEnroll: omit,
  updateEnrollKey: omit,
  deleteEnroll: omit,
};

const studentEnrollContext = createContext(initialState);

interface StudentEnrollProviderProps {}

export const StudentEnrollProvider: FC<StudentEnrollProviderProps> = ({
  children,
}) => {
  const [enrolls, setEnrolls] = useState<StudentEnroll[]>([]);
  const [lastDoc, setLastDoc] = useState<DocumentData>();

  const addEnroll = (enroll?: EnrollInfo) => {
    addDoc(enrollRef, enroll as any).then((doc) => {
      setEnrolls((state) => [
        { id: doc.id, ...studentEnrollFromInfo(enroll) },
        ...state,
      ]);
    });
  };

  const fetchEnrolls: FetchData = useCallback(
    ({
      size = 20,
      options: {
        onFulfilled = debug((value) => console.log("FULFILLED", value)),
        onRejected = debug((value) => console.log("REJECTED", value)),
      } = {},
    } = {}) => {
      const q = query(
        enrollRef,
        orderBy("enroll.dateCreated", "desc"),
        limit(size),
        ...(lastDoc ? [startAfter(lastDoc)] : [])
      );

      getDocs(q)
        .then((querySnapshot) => {
          setEnrolls((state) => {
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
        .catch(debug((value) => console.log("ERROR", value)));
    },
    [lastDoc]
  );

  const refreshEnroll = useCallback((id: string, duration = 48) => {
    const now = new Date();
    const updates: any = {
      "enroll.expiresAt": shiftDate(now, { hour: duration }),
    };

    updateDoc(doc(enrollRef, id), updates).then(() => {
      setEnrolls((state) =>
        state.map((data) =>
          data.id === id ? applyUpdates(data, updates) : data
        )
      );
    });
  }, []);

  const updateEnrollKey = useCallback((id: string, key: string) => {
    const updates: any = { "enroll.key": key };

    updateDoc(doc(enrollRef, id), updates).then(() => {
      setEnrolls((state) =>
        state.map((data) =>
          data.id === id ? applyUpdates(data, updates) : data
        )
      );
    });
  }, []);

  const deleteEnroll = useCallback((id: string) => {
    deleteDoc(doc(enrollRef, id)).then(() =>
      setEnrolls((state) => state.filter((data) => data.id !== id))
    );
  }, []);

  return (
    <studentEnrollContext.Provider
      value={{
        ...initialState,
        addEnroll,
        fetchEnrolls,
        refreshEnroll,
        updateEnrollKey,
        deleteEnroll,
        enrolls,
      }}
    >
      {children}
    </studentEnrollContext.Provider>
  );
};

export const useStudentEnrollContext = () => useContext(studentEnrollContext);
