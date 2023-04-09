import { collection } from "firebase/firestore";
import { create } from "zustand";

import { AddDataFunc, FetchDataFunc, UpdateDataFunc } from "models";
import { DataMap } from "models/abstract";
import { changeDateUpdated } from "models/blocks";
import {
  Payment,
  paymentConverter,
  PaymentDB,
  PaymentDBData,
} from "models/payment";
import { db } from "services/firebase";

import { addDocFactory, getDocsFactory, updateDocFactory } from "./_internal";

const collectionRef = collection(db, "payments");
const paymentRef = collectionRef.withConverter(paymentConverter);

interface PaymentStore {
  data: DataMap<Payment>;
  add: AddDataFunc<PaymentDB>;
  fetch: FetchDataFunc<PaymentDBData>;
  update: UpdateDataFunc<PaymentDBData>;
}

const usePaymentStore = create<PaymentStore>()((set) => ({
  data: new DataMap(),
  add: addDocFactory({
    collectionRef: paymentRef,
    setData: (payment) =>
      set(({ data }) => ({ data: data.addAt("start", payment) })),
    DataClass: Payment,
  }),
  fetch: getDocsFactory({
    collectionRef: paymentRef,
    setData: (payments) =>
      set(({ data }) => ({ data: data.addAt("end", ...payments) })),
    fetchDefaults: { sort: { by: "meta.dateCreated", direction: "desc" } },
  }),
  update: updateDocFactory({
    collectionRef,
    setData: (id, updates) =>
      set(({ data }) => ({ data: data.updateAt(id, updates) })),
    processUpdates: changeDateUpdated("meta"),
  }),
}));

export default usePaymentStore;
