import { addDoc, collection } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";

import { db, functions } from "services/firebase";

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
