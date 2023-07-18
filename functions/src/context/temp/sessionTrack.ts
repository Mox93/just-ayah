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
import { dateTimeToCell, dateToCell } from "@utils";

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
).onCreate((snapshot, context) => {
  const id = context.params[DOC_ID_VAR];
  return addRowToSheet(
    LOGS_SHEET_ID,
    LOGS_RANGE_NAME,
    dataToRow(id, snapshot.data() as SessionTrackData)
  );
});

export const onSessionTrackUpdate = document(
  TEMP_SESSION_TRACK_PATH(DOC_ID_CARD)
).onUpdate((snapshot, context) => {
  const id = context.params[DOC_ID_VAR];
  return changeRowInSheet(
    LOGS_SHEET_ID,
    LOGS_TAB_NAME,
    id,
    dataToRow(id, snapshot.after.data() as SessionTrackData)
  );
});

export const deleteSessionTrack = onCall(async (data?: { id?: string }) => {
  const { id } = data || {};

  if (!id) throw new HttpsError("invalid-argument", "No 'id' was provided!");

  return Promise.all([
    moveToDeleted(TEMP_SESSION_TRACK_PATH(id)),
    removeRowFromSheet(LOGS_SHEET_ID, LOGS_TAB_NAME, LOGS_TAB_ID, id),
  ]);
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
    `=HYPERLINK(CONCAT($B$1,"${id}"),"تعديل")`,
  ];
}
