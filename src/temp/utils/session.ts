import { addDoc, collection } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";

import { db, functions } from "services/firebase";

/*********************\
|*** Session Track ***|
\*********************/

const sessionTrackRef = collection(db, "meta/temp/sessionTrack");
export interface SessionTrackData {
  teacher: string;
  student: string;
  status: string;
  date: Date;
  notes?: string;
}

export async function addSessionTrack(data: SessionTrackData) {
  console.log(data);
  return await addDoc(sessionTrackRef, { ...data, timestamp: new Date() });
}

export const deleteSessionTrack = httpsCallable<{ id: string }>(
  functions,
  "deleteSessionTrack"
);

/**********************\
|*** Session Report ***|
\**********************/

const sessionReportRef = collection(db, "meta/temp/sessionReport");

interface Recital {
  chapter: string;
  from: number;
  to: number;
  rating: string;
}

export interface SessionReportData extends SessionTrackData {
  recital: Recital[];
  memorization: Omit<Recital, "rating">[];
  rules: string[];
}

export async function addSessionReport(data: SessionReportData) {
  console.log(data);
  return await addDoc(sessionReportRef, { ...data, timestamp: new Date() });
}

export const deleteSessionReport = httpsCallable<{ id: string }>(
  functions,
  "deleteSessionReport"
);
