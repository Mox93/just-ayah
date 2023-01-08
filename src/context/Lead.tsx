import {
  addDoc,
  collection,
  DocumentData,
  getDocs,
  limit,
  orderBy,
  OrderByDirection,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { createContext, FC, useCallback, useContext, useState } from "react";

import { db } from "services/firebase";
import {
  Lead,
  LeadInfo,
  LeadInDB,
  leadFromDB,
  leadFromInfo,
} from "models/lead";
import { AddData, FetchData } from "models";
import { devOnly, omit } from "utils";

interface LeadContext {
  data: { leads: Lead[] };
  add: AddData<LeadInfo>;
  fetch: FetchData;
}

const initialState: LeadContext = {
  data: { leads: [] },
  add: omit,
  fetch: omit,
};

const leadContext = createContext(initialState);

interface LeadProviderProps {}

export const LeadProvider: FC<LeadProviderProps> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [lastDoc, setLastDoc] = useState<DocumentData>();
  const collectionRef = collection(db, "leads");

  const add: AddData<LeadInfo> = useCallback(
    (data, { onFulfilled, onRejected = console.log } = {}) => {
      addDoc(collectionRef, leadFromInfo(data))
        .then(onFulfilled, onRejected)
        .catch(console.log);
    },
    [collectionRef]
  );

  const fetch: FetchData = useCallback(
    ({
      filters = [],
      size = 20,
      sort = { by: "meta.dateCreated", direction: "desc" as OrderByDirection },
      options: {
        onFulfilled = devOnly((value) => console.log("FULFILLED", value)),
        onRejected = devOnly((value) => console.log("REJECTED", value)),
      } = {},
    } = {}) => {
      const q = query(
        collectionRef,
        ...filters.map((filter) => where(...filter)),
        limit(size),
        orderBy(sort.by, sort.direction),
        ...(lastDoc ? [startAfter(lastDoc)] : [])
      );

      getDocs(q).then((querySnapshot) => {
        setLeads((state) => {
          const newState = [...state];

          querySnapshot.docs.forEach((doc, i) => {
            newState.push(leadFromDB(doc.id, doc.data() as LeadInDB));

            if (i === size - 1) {
              setLastDoc(doc);
            }
          });

          return newState;
        });

        onFulfilled(querySnapshot);
      }, onRejected);
    },
    [collectionRef, lastDoc]
  );

  return (
    <leadContext.Provider value={{ add, fetch, data: { leads: leads } }}>
      {children}
    </leadContext.Provider>
  );
};

export const useLeadContext = () => useContext(leadContext);
