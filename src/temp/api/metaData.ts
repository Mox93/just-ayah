import { isEmpty } from "lodash";
import { Timestamp, getDoc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { createStore, useStore } from "zustand";

import { useApplyOnce } from "hooks";
import { IS_DEV } from "models/config";
import { functions } from "services/firebase";

import { tempRef } from "./temp";

export interface ChapterData {
  chapter: string;
  verses: number;
}

interface SessionStatus {
  value: string;
  needsReport: boolean;
}

interface MetaData {
  staff: string[];
  teachers: Record<string, string[]>;
  courses: Record<string, ChapterData[]>;
  sessionStatus: SessionStatus[];
  subscriptions: string[];
  monthlySessions: string[];
  recitationRules: string[];
  unassignedStudents: string[];
  noMatchTeachers: Record<string, string[]>;
}

interface CachedMetaData {
  data: MetaData;
  ttl: number;
  updatedAt: Timestamp;
}

export function useMetaData() {
  const metaData = useStore(metaDataStore);

  useApplyOnce(() => {
    getCachedMetaData().catch(getFreshMetaData).then(setMetaData);
  }, isEmpty(metaData));

  return metaData;
}

export async function refreshMetaData() {
  const metaData = await getFreshMetaData();
  setMetaData(metaData);
}

async function getCachedMetaData() {
  const result = await getDoc(tempRef);
  const {
    metaData: { data, ttl, updatedAt },
  } = result.data() as { metaData: CachedMetaData };

  if (IS_DEV) console.log("cachedMetaData", data);

  const passedTime = new Date().getTime() - updatedAt.toDate().getTime();

  if (passedTime < ttl) return data;

  throw new Error("expired");
}

async function getFreshMetaData() {
  const data = (await getMetaData({ fresh: true })).data;

  if (IS_DEV) console.log("freshMetaData", data);

  return data;
}

function setMetaData(data: MetaData) {
  return metaDataStore.setState(data);
}

const metaDataStore = createStore<Partial<MetaData>>()(() => ({}));

const getMetaData = httpsCallable<{ fresh?: boolean }, MetaData>(
  functions,
  "getMetaData"
);
