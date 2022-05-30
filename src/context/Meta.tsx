import {
  collection,
  documentId,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { createContext, FC, useContext, useEffect, useReducer } from "react";

import { MetaData, metaDataDocs } from "models/metaData";
import { db } from "services/firebase";

import { useAuthContext } from ".";

const collectionRef = collection(db, "meta");

interface MetaContext {
  data: MetaData;
}

const initialState: MetaContext = {
  data: {},
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
        dispatch({ type: "update", payload: metaData });

        console.log("metaData", metaData);
      },
      error: (error) => {
        console.log("error", error);
      },
    });
  }, [isAuthorized]);

  return (
    <metaContext.Provider value={context}>{children}</metaContext.Provider>
  );
};

export const useMetaContext = () => useContext(metaContext);

type State = { context: MetaContext };

type Action = { type: "update"; payload: MetaData };

const reducer = (state: State, { type, payload }: Action): State => {
  switch (type) {
    case "update":
      return { ...state, context: { data: payload } };
    default:
      return state;
  }
};
