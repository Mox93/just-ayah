import { isEmpty } from "lodash";
import { Timestamp, collection, doc, getDoc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { create } from "zustand";

import { useApplyOnce } from "hooks";
import { db, functions } from "services/firebase";

interface ChapterData {
  verses: number;
  chapter: string;
}

interface MetaData {
  staff: string[];
  teachers: Record<string, string[]>;
  courses: Record<string, ChapterData[]>;
  subscriptions: string[];
  monthlySessions: string[];
  sessionStatus: string[];
  recitationRules: string[];
  unassignedStudents: string[];
  noMatchTeachers: Record<string, string[]>;
}

export function useMetaData() {
  const metaData = useMetaDataStore();

  useApplyOnce(() => {
    getCachedMetaData()
      .then(([data, expired]) => (expired ? getFreshMetaData() : data))
      .catch(() => getFreshMetaData())
      .then((data) => useMetaDataStore.setState(data));
  }, isEmpty(metaData));

  return metaData;
}

export async function refreshMetaData() {
  const metaData = await getFreshMetaData();
  useMetaDataStore.setState(metaData);
}

const useMetaDataStore = create<Partial<MetaData>>()(() => ({}));

const getMetaData = httpsCallable<{ fresh?: boolean }, MetaData>(
  functions,
  "getMetaData"
);

async function getFreshMetaData() {
  const data = (await getMetaData({ fresh: true })).data;
  console.log("freshMetaData", data);
  return data;
}

interface CachedMetaData {
  data: MetaData;
  ttl: number;
  updatedAt: Timestamp;
}

async function getCachedMetaData() {
  const result = await getDoc(doc(collection(db, "meta"), "temp"));
  const {
    metaData: { data, ttl, updatedAt },
  } = result.data() as { metaData: CachedMetaData };

  console.log("cachedMetaData", data);
  return [
    data,
    !(updatedAt.toDate().getTime() + ttl > new Date().getTime()),
  ] as const;
}
