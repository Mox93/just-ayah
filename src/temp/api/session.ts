import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { z } from "zod";

import { dateSchema } from "models/blocks";
import { functions } from "services/firebase";

import { TEMP_REF } from "./temp";

/*********************\
|*** Session Track ***|
\*********************/

const SESSION_TRACK_REF = collection(TEMP_REF, "sessionTrack");

const sessionTrackSchema = z.object({
  teacher: z.string(),
  student: z.string(),
  status: z.string(),
  notes: z.string().optional(),
  date: dateSchema,
});

export type SessionTrackData = z.infer<typeof sessionTrackSchema>;

export async function getSessionTrack(id: string) {
  const data = (await getDoc(doc(SESSION_TRACK_REF, id))).data();
  return data && sessionTrackSchema.parse(data);
}

export function addSessionTrack(data: SessionTrackData) {
  return addDoc(SESSION_TRACK_REF, { ...data, timestamp: new Date() });
}

export function updateSessionTrack(
  id: string,
  data: Partial<SessionTrackData>
) {
  return updateDoc(doc(SESSION_TRACK_REF, id), {
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

const sessionReportRef = collection(TEMP_REF, "sessionReport");

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
