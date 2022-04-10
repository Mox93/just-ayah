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
import {
  createContext,
  FunctionComponent,
  useCallback,
  useContext,
  useState,
} from "react";

import { db } from "services/firebase";
import {
  Customer,
  CustomerInfo,
  CustomerInDB,
  customerFromDB,
  customerFromInfo,
} from "models/customer";
import { AddData, FetchData } from "models";
import { omit } from "utils";

interface CustomersContextObj {
  data: Customer[];
  addCustomer: AddData<CustomerInfo>;
  fetchCustomers: FetchData;
}

const CustomersContext = createContext<CustomersContextObj>({
  data: [],
  addCustomer: omit,
  fetchCustomers: omit,
});

interface CustomersProviderProps {}

export const CustomersProvider: FunctionComponent<CustomersProviderProps> = ({
  children,
}) => {
  const [data, setData] = useState<Customer[]>([]);
  const [lastDoc, setLastDoc] = useState<DocumentData>();
  const collectionRef = collection(db, "customers");

  const addCustomer: AddData<CustomerInfo> = useCallback(
    (data, { onfulfilled = omit, onrejected = console.log } = {}) => {
      addDoc(collectionRef, customerFromInfo(data))
        .then(onfulfilled, onrejected)
        .catch(console.log);
    },
    [collectionRef]
  );

  const fetchCustomers: FetchData = useCallback(
    ({
      filters = [],
      size = 20,
      sort = { by: "meta.dateCreated", direction: "desc" as OrderByDirection },
      callback: { onfulfilled = omit, onrejected = console.log } = {},
    } = {}) => {
      const q = query(
        collectionRef,
        ...filters.map((filter) => where(...filter)),
        limit(size),
        orderBy(sort.by, sort.direction),
        ...(lastDoc ? [startAfter(lastDoc)] : [])
      );

      getDocs(q).then((querySnapshot) => {
        setData((state) => {
          const newState = [...state];

          querySnapshot.docs.forEach((doc, i) => {
            newState.push(customerFromDB(doc.id, doc.data() as CustomerInDB));

            if (i === size - 1) {
              setLastDoc(doc);
            }
          });

          return newState;
        });

        onfulfilled(querySnapshot);
      }, onrejected);
    },
    [collectionRef, lastDoc]
  );

  return (
    <CustomersContext.Provider value={{ addCustomer, fetchCustomers, data }}>
      {children}
    </CustomersContext.Provider>
  );
};

export const useCustomers = () => useContext(CustomersContext);
