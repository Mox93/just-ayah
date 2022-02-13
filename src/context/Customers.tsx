import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { createContext, FunctionComponent, useContext, useState } from "react";

import { db } from "services/firebase";
import {
  Customer,
  CustomerInfo,
  CustomerInDB,
  customerFromDB,
  customerFromInfo,
} from "models/customer";
import { ProviderProps } from "models";
import { omit } from "utils";

interface CustomersContextObj {
  data: Customer[];
  addCustomer: (
    data: CustomerInfo,
    onfulfilled?: (response: any) => void,
    onrejected?: (response: any) => void
  ) => void;
  fetchCustomers: (state?: string) => void;
  archiveCustomer: (customer: Customer) => void;
}

const CustomersContext = createContext<CustomersContextObj>({
  data: [],
  addCustomer: omit,
  fetchCustomers: omit,
  archiveCustomer: omit,
});

interface CustomersProviderProps extends ProviderProps {}

export const CustomersProvider: FunctionComponent<CustomersProviderProps> = ({
  children,
}) => {
  const [data, setData] = useState<Customer[]>([]);
  const customersRef = collection(db, "customers");

  const addCustomer = (
    data: CustomerInfo,
    onfulfilled: (response: any) => void = omit,
    onrejected: (response: any) => void = console.log
  ) => {
    addDoc(customersRef, customerFromInfo(data))
      .then(onfulfilled, onrejected)
      .catch(console.log);
  };

  const fetchCustomers = async (status?: string) => {
    const q =
      status !== undefined
        ? query(customersRef, where("meta.status", "==", status), limit(20))
        : customersRef;
    const querySnapshot = await getDocs(q);
    const newData: Customer[] = [];

    querySnapshot.docs.forEach((doc) =>
      newData.push(customerFromDB(doc.id, doc.data() as CustomerInDB))
    );

    setData(newData);
  };

  const archiveCustomer = (customer: Customer) => {
    updateDoc(doc(customersRef, customer.id), {
      meta: { ...customer.meta, state: "archived", dateUpdated: new Date() },
    });
  };

  return (
    <CustomersContext.Provider
      value={{ addCustomer, fetchCustomers, archiveCustomer, data }}
    >
      {children}
    </CustomersContext.Provider>
  );
};

export const useCustomers = () => useContext(CustomersContext);
