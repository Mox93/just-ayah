import {
  DOC_ID_CARD,
  DOC_ID_VAR,
  LOGS_RANGE_NAME,
  LOGS_SHEET_ID,
  LOGS_TAB_ID,
  LOGS_TAB_NAME,
  TEMP_SESSION_TRACK_PATH,
} from "@config";
import { HttpsError, document, onCall } from "@lib";
import { addRowToSheet, changeRowInSheet, removeRowFromSheet } from "@services";

import { moveToDeleted } from "./utils";
import { dateTimeToCell, dateToCell, editLinkCell } from "@utils";

export interface SessionTrackData {
  teacher: string;
  student: string;
  status: string;
  date: Date;
  timestamp: Date;
  notes?: string;
}

export const onSessionTrackCreate = document(
  TEMP_SESSION_TRACK_PATH(DOC_ID_CARD)
).onCreate(async (snapshot, context) => {
  const id = context.params[DOC_ID_VAR];
  return await addRowToSheet(
    LOGS_SHEET_ID.value(),
    LOGS_RANGE_NAME.value(),
    dataToRow(id, snapshot.data() as SessionTrackData)
  );
});

export const onSessionTrackUpdate = document(
  TEMP_SESSION_TRACK_PATH(DOC_ID_CARD)
).onUpdate(async (snapshot, context) => {
  const id = context.params[DOC_ID_VAR];
  return await changeRowInSheet(
    LOGS_SHEET_ID.value(),
    LOGS_TAB_NAME.value(),
    id,
    dataToRow(id, snapshot.after.data() as SessionTrackData)
  );
});

export const deleteSessionTrack = onCall(async (data?: { id?: string }) => {
  const { id } = data || {};

  if (!id) throw new HttpsError("invalid-argument", "No 'id' was provided!");

  await moveToDeleted(TEMP_SESSION_TRACK_PATH(""), id);
  await removeRowFromSheet(
    LOGS_SHEET_ID.value(),
    LOGS_TAB_NAME.value(),
    LOGS_TAB_ID.value(),
    id
  );

  return null;
});

function dataToRow(
  id: string,
  { timestamp, teacher, student, date, status, notes }: SessionTrackData
) {
  return [
    id,
    dateTimeToCell(timestamp),
    dateToCell(date),
    teacher,
    student,
    status,
    notes,
    editLinkCell(id),
  ];
}
