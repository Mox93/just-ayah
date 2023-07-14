import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { z } from "zod";

import { dateSchema } from "models/blocks";
import { functions } from "services/firebase";

import { tempRef } from "./temp";

/*********************\
|*** Session Track ***|
\*********************/

const sessionTrackRef = collection(tempRef, "sessionTrack");

const sessionTrackSchema = z.object({
  teacher: z.string(),
  student: z.string(),
  status: z.string(),
  notes: z.string().optional(),
  date: dateSchema,
});

export type SessionTrackData = z.infer<typeof sessionTrackSchema>;

export async function getSessionTrack(id: string) {
  const data = (await getDoc(doc(sessionTrackRef, id))).data();
  return data ? sessionTrackSchema.parse(data) : data;
}

export async function addSessionTrack(data: SessionTrackData) {
  return await addDoc(sessionTrackRef, { ...data, timestamp: new Date() });
}

export async function updateSessionTrack(id: string, data: SessionTrackData) {
  return await updateDoc(doc(sessionTrackRef, id), {
    ...data,
    updateAt: new Date(),
  });
}

export const deleteSessionTrack = httpsCallable<{ id: string }>(
  functions,
  "deleteSessionTrack"
);

/**********************\
|*** Session Report ***|
\**********************/

const sessionReportRef = collection(tempRef, "sessionReport");

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
