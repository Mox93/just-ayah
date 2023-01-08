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
import { useCallback, useState } from "react";

import { DBConverter, FetchData } from "models";
import {
  userEnrollConverter,
  EnrollInfo,
  UserEnroll,
  userEnrollFromInfo,
  shiftDate,
} from "models/blocks";
import { db } from "services/firebase";
import { applyUpdates, devOnly } from "utils";
import { initialState } from "./models";

interface UseEnrollProps<TUserInDB, TUser> {
  collectionName: string;
  converterFromDB: DBConverter<TUserInDB, TUser>;
}

export const useEnroll = <TUserInDB, TUser>({
  collectionName,
  converterFromDB,
}: UseEnrollProps<TUserInDB, TUser>) => {
  const collectionRef = collection(db, collectionName);
  const enrollRef = collectionRef.withConverter(
    userEnrollConverter(converterFromDB)
  );

  const [enrolls, setEnrolls] = useState<UserEnroll<TUser>[]>([]);
  const [lastDoc, setLastDoc] = useState<DocumentData>();

  const addEnroll = (enroll?: EnrollInfo) => {
    addDoc(enrollRef, enroll as any).then((doc) => {
      setEnrolls((state) => [
        {
          id: doc.id,
          ...userEnrollFromInfo<TUser>(enroll),
        } as UserEnroll<TUser>,
        ...state,
      ]);
    });
  };

  const fetchEnrolls: FetchData = useCallback(
    ({
      size = 20,
      options: {
        onFulfilled = devOnly((value) => console.log("FULFILLED", value)),
        onRejected = devOnly((value) => console.log("REJECTED", value)),
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
        .catch(devOnly((value) => console.log("ERROR", value)));
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

  return {
    ...initialState,
    addEnroll,
    fetchEnrolls,
    refreshEnroll,
    updateEnrollKey,
    deleteEnroll,
    enrolls,
  };
};
