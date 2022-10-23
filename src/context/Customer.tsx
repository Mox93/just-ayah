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
  Customer,
  CustomerInfo,
  CustomerInDB,
  customerFromDB,
  customerFromInfo,
} from "models/customer";
import { AddData, FetchData } from "models";
import { devOnly, omit } from "utils";

interface CustomerContext {
  data: { customers: Customer[] };
  add: AddData<CustomerInfo>;
  fetch: FetchData;
}

const initialState: CustomerContext = {
  data: { customers: [] },
  add: omit,
  fetch: omit,
};

const customerContext = createContext(initialState);

interface CustomerProviderProps {}

export const CustomerProvider: FC<CustomerProviderProps> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [lastDoc, setLastDoc] = useState<DocumentData>();
  const collectionRef = collection(db, "customers");

  const add: AddData<CustomerInfo> = useCallback(
    (data, { onFulfilled, onRejected = console.log } = {}) => {
      addDoc(collectionRef, customerFromInfo(data))
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
        setCustomers((state) => {
          const newState = [...state];

          querySnapshot.docs.forEach((doc, i) => {
            newState.push(customerFromDB(doc.id, doc.data() as CustomerInDB));

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
    <customerContext.Provider value={{ add, fetch, data: { customers } }}>
      {children}
    </customerContext.Provider>
  );
};

export const useCustomerContext = () => useContext(customerContext);
