import {
  DOC_ID_CARD,
  DOC_ID_VAR,
  SESSION_TRACK_RANGE_NAME,
  SESSION_TRACK_SHEET_ID,
  SESSION_TRACK_TAB_ID,
  SESSION_TRACK_TAB_NAME,
  TEMP_SESSION_TRACK_PATH,
} from "@config";
import { HttpsError, document, onCall } from "@lib";
import { addRowToSheet, changeRowInSheet, removeRowFromSheet } from "@services";
import { SessionTrackData } from "@types";
import { dateTimeToCell, dateToCell, editLinkCell } from "@utils";

import { moveToDeleted } from "./utils";

export const onSessionTrackCreate = document(
  TEMP_SESSION_TRACK_PATH(DOC_ID_CARD)
).onCreate(async (snapshot, context) => {
  const id = context.params[DOC_ID_VAR];
  return await addRowToSheet(
    SESSION_TRACK_SHEET_ID.value(),
    SESSION_TRACK_RANGE_NAME.value(),
    dataToRow(id, snapshot.data() as SessionTrackData)
  );
});

export const onSessionTrackUpdate = document(
  TEMP_SESSION_TRACK_PATH(DOC_ID_CARD)
).onUpdate(async (snapshot, context) => {
  const id = context.params[DOC_ID_VAR];
  return await changeRowInSheet(
    SESSION_TRACK_SHEET_ID.value(),
    SESSION_TRACK_TAB_NAME.value(),
    id,
    dataToRow(id, snapshot.after.data() as SessionTrackData)
  );
});

export const deleteSessionTrack = onCall(async (data?: { id?: string }) => {
  const { id } = data || {};

  if (!id) throw new HttpsError("invalid-argument", "No 'id' was provided!");

  await moveToDeleted(TEMP_SESSION_TRACK_PATH(""), id);
  await removeRowFromSheet(
    SESSION_TRACK_SHEET_ID.value(),
    SESSION_TRACK_TAB_NAME.value(),
    SESSION_TRACK_TAB_ID.value(),
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
