import { collection } from "firebase/firestore";
import { createContext, FC, useContext, useState } from "react";

import { db } from "services/firebase";
import Lead, { leadConverter, LeadDB, LeadDBData } from "models/lead";
import { AddDataFunc, FetchDataFunc } from "models";
import { assert } from "utils";
import { useAddDoc, useGetDocs } from "hooks/Collection";

const COLLECTION_NAME = "leads";

const collectionRef = collection(db, COLLECTION_NAME);
const leadRef = collectionRef.withConverter(leadConverter);

interface LeadContext {
  leads: Lead[];
  addLead: AddDataFunc<LeadDB>;
  fetchLeads: FetchDataFunc<LeadDBData>;
}

const leadContext = createContext<LeadContext | null>(null);

interface LeadProviderProps {}

export const LeadProvider: FC<LeadProviderProps> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>([]);

  const addLead = useAddDoc({
    collectionRef: leadRef,
    setData: setLeads,
    DataClass: Lead,
  });

  const fetchLeads = useGetDocs<Lead, LeadDBData>({
    collectionRef: leadRef,
    setData: setLeads,
  });

  return (
    <leadContext.Provider value={{ leads, addLead, fetchLeads }}>
      {children}
    </leadContext.Provider>
  );
};

export function useLeadContext() {
  const context = useContext(leadContext);
  assert(context !== null);
  return context;
}
