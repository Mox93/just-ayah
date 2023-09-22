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

const SESSION_REPORT_REF = collection(TEMP_REF, "sessionReport");

const chapterVersusSchema = z.object({
  chapter: z.string(),
  from: z.number().int().positive(),
  to: z.number().int().positive(),
  rating: z.string(),
});

const sessionReportSchema = sessionTrackSchema.merge(
  z.object({
    recitation: chapterVersusSchema.array(),
    memorization: chapterVersusSchema.omit({ rating: true }).array(),
    rules: z.string().array(),
  })
);

export type SessionReportData = z.infer<typeof sessionReportSchema>;

export async function getSessionReport(id: string) {
  const data = (await getDoc(doc(SESSION_REPORT_REF, id))).data();
  return data && sessionReportSchema.parse(data);
}

export async function addSessionReport(data: SessionReportData) {
  console.log(data);
  return await addDoc(SESSION_REPORT_REF, { ...data, timestamp: new Date() });
}

export function updateSessionReport(
  id: string,
  data: Partial<SessionReportData>
) {
  return updateDoc(doc(SESSION_REPORT_REF, id), {
    ...data,
    updateAt: new Date(),
  });
}

export const deleteSessionReport = httpsCallable<{ id: string }>(
  functions,
  "deleteSessionReport"
);
