import {
  collection,
  documentId,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { createContext, FC, useContext, useEffect, useReducer } from "react";

import {
  MetaData,
  metaDataDocs,
  MetaDataInDB,
  personIndexFromDB,
} from "models/metaData";
import { db } from "services/firebase";
import { devOnly } from "utils";

import { useAuthContext } from ".";

const collectionRef = collection(db, "meta");

interface MetaContext extends MetaData {}

const initialState: MetaContext = {
  shortList: {},
  studentIndex: [],
  teacherIndex: [],
};

const metaContext = createContext(initialState);

interface MetaProviderProps {}

export const MetaProvider: FC<MetaProviderProps> = ({ children }) => {
  const [{ context }, dispatch] = useReducer(reducer, {
    context: initialState,
  });

  const { authorized } = useAuthContext();
  const isAuthorized = authorized();

  useEffect(() => {
    if (!isAuthorized) return;

    const q = query(collectionRef, where(documentId(), "in", metaDataDocs));

    return onSnapshot(q, {
      next: (snapshot) => {
        const metaData: any = {};
        snapshot.forEach((doc) => (metaData[doc.id] = doc.data()));
        devOnly(() => console.log("Got metaData"));

        dispatch({ type: "populate", payload: metaData });
      },
      error: (error) => {
        console.log("ERROR", error);
      },
    });
  }, [isAuthorized]);

  return (
    <metaContext.Provider value={context}>{children}</metaContext.Provider>
  );
};

export const useMetaContext = () => useContext(metaContext);

type State = { context: MetaContext };

type Action = { type: "populate"; payload: MetaDataInDB };

const reducer = (state: State, { type, payload }: Action): State => {
  switch (type) {
    case "populate":
      const { shortList = {}, studentIndex = {}, teacherIndex = {} } = payload;
      return {
        ...state,
        context: {
          shortList,
          studentIndex: personIndexFromDB(studentIndex),
          teacherIndex: personIndexFromDB(teacherIndex),
        },
      };
    default:
      return state;
  }
};
