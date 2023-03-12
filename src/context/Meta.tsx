import {
  collection,
  documentId,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

import { MetaData, META_DATA_DOCS } from "models/metaData";
import { db } from "services/firebase";
import { oneOf } from "utils";

import { useAuthContext } from ".";
import { IS_DEV } from "models/config";
import { userIndexListSchema } from "models/blocks";
import { ERROR } from "models";

const collectionRef = collection(db, "meta");

interface MetaContext extends MetaData {}

const initialState: MetaContext = {
  shortList: {},
  studentIndex: [],
  teacherIndex: [],
};

const metaContext = createContext(initialState);

export function MetaProvider({ children }: PropsWithChildren) {
  const [metaData, setMetaData] = useState(initialState);

  const { authorized } = useAuthContext();
  const isAuthorized = authorized();

  useEffect(() => {
    if (!isAuthorized) return;

    const q = query(collectionRef, where(documentId(), "in", META_DATA_DOCS));

    return onSnapshot(q, {
      next: (snapshot) => {
        const data: any = {};
        snapshot.forEach((doc) => {
          if (oneOf(doc.id, ["studentIndex", "teacherIndex"])) {
            const result = userIndexListSchema.safeParse(doc.data());

            if (IS_DEV && !result.success) {
              console.log(ERROR, result.error);
            }

            data[doc.id] = result.success ? result.data : [];
          } else {
            data[doc.id] = doc.data();
          }
        });

        if (IS_DEV) console.log("Got metaData", data);

        setMetaData(data);
      },
      error: (error) => {
        console.log("ERROR", error);
      },
    });
  }, [isAuthorized]);

  return (
    <metaContext.Provider value={metaData}>{children}</metaContext.Provider>
  );
}

export function useMetaContext() {
  return useContext(metaContext);
}
