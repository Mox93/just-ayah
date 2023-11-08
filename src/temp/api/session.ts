import {
  addDoc,
  collection,
  doc,
  getDoc,
  updateDoc,
  deleteField,
} from "firebase/firestore";
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

interface DuplicationCheckArgs {
  student: string;
  date: string;
}

type DuplicationCheckResponse<T> =
  | { duplicated: false }
  | { duplicated: true; sessions: Record<string, T> };

export async function getSessionTrack(id: string) {
  const data = (await getDoc(doc(SESSION_TRACK_REF, id))).data();
  return data && sessionTrackSchema.parse(data);
}

const isDuplicatedSessionTrack = httpsCallable<
  DuplicationCheckArgs,
  DuplicationCheckResponse<SessionTrackData>
>(functions, "isDuplicatedSessionTrack");

export const DUPLICATED_SESSION = "Duplicated Session";

export async function addSessionTrack(data: SessionTrackData) {
  const { data: result } = await isDuplicatedSessionTrack({
    student: data.student,
    date: data.date?.toISOString(),
  });

  if (result.duplicated) {
    throw new Error(
      `تم تسجيل استيمارة مسبقاً للطالب/ة "${data.student}"
      بتاريخ (${data.date.toDateString()})`,
      { cause: DUPLICATED_SESSION }
    );
  }

  return await addDoc(SESSION_TRACK_REF, { ...data, timestamp: new Date() });
}

export async function updateSessionTrack(
  id: string,
  data: Partial<SessionTrackData>
) {
  return await updateDoc(doc(SESSION_TRACK_REF, id), {
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
  course: z.string().optional(),
  chapter: z.string(),
  from: z.number().int().positive(),
  to: z.number().int().positive(),
  rating: z.string(),
});

const sessionReportSchema = sessionTrackSchema.merge(
  z.object({
    recitation: chapterVersusSchema.array().optional(),
    memorization: chapterVersusSchema.omit({ rating: true }).array().optional(),
    rules: z.string().array().optional(),
    otherRules: z.string().optional(),
  })
);

export type SessionReportData = z.infer<typeof sessionReportSchema>;

export async function getSessionReport(id: string) {
  const data = (await getDoc(doc(SESSION_REPORT_REF, id))).data();
  return data && sessionReportSchema.parse(data);
}

const isDuplicatedSessionReport = httpsCallable<
  DuplicationCheckArgs,
  DuplicationCheckResponse<SessionReportData>
>(functions, "isDuplicatedSessionReport");

export async function addSessionReport({ rules, ...data }: SessionReportData) {
  const { data: result } = await isDuplicatedSessionReport({
    student: data.student,
    date: data.date?.toISOString(),
  });

  if (result.duplicated) {
    throw new Error(
      `تم تسجيل استيمارة مسبقاً للطالب/ة "${data.student}"
      بتاريخ (${data.date.toDateString()})`,
      { cause: DUPLICATED_SESSION }
    );
  }

  return await addDoc(SESSION_REPORT_REF, {
    ...data,
    ...(typeof rules === "string"
      ? { rules: (rules as string).split(",") }
      : rules
      ? { rules }
      : {}),
    timestamp: new Date(),
  });
}

export function updateSessionReport(
  id: string,
  data: Partial<SessionReportData>
) {
  return updateDoc(doc(SESSION_REPORT_REF, id), {
    ...data,
    recitation: data.recitation || deleteField(),
    memorization: data.memorization || deleteField(),
    rules: data.rules || deleteField(),
    updateAt: new Date(),
  });
}

export const deleteSessionReport = httpsCallable<{ id: string }>(
  functions,
  "deleteSessionReport"
);
