import {
  DOC_ID_CARD,
  DOC_ID_VAR,
  SESSION_REPORT_RANGE_NAME,
  SESSION_REPORT_SHEET_ID,
  SESSION_REPORT_TAB_ID,
  SESSION_REPORT_TAB_NAME,
  TEMP_SESSION_REPORT_PATH,
} from "@config";
import { HttpsError, document, onCall } from "@lib";
import { addRowToSheet, changeRowInSheet, removeRowFromSheet } from "@services";
import { SessionReportData } from "@types";
import {
  chapterVersusCell,
  dateTimeToCell,
  dateToCell,
  editLinkCell,
  rulesCell,
} from "@utils";

import { isDuplicatedSession, moveToDeleted } from "./utils";

export const onSessionReportCreate = document(
  TEMP_SESSION_REPORT_PATH(DOC_ID_CARD)
).onCreate(async (snapshot, context) => {
  const id = context.params[DOC_ID_VAR];
  return await addRowToSheet(
    SESSION_REPORT_SHEET_ID.value(),
    SESSION_REPORT_RANGE_NAME.value(),
    dataToRow(id, snapshot.data() as SessionReportData)
  );
});

export const onSessionReportUpdate = document(
  TEMP_SESSION_REPORT_PATH(DOC_ID_CARD)
).onUpdate(async (snapshot, context) => {
  const id = context.params[DOC_ID_VAR];
  return await changeRowInSheet(
    SESSION_REPORT_SHEET_ID.value(),
    SESSION_REPORT_TAB_NAME.value(),
    id,
    dataToRow(id, snapshot.after.data() as SessionReportData)
  );
});

export const deleteSessionReport = onCall(async (data?: { id?: string }) => {
  const { id } = data || {};

  if (!id) throw new HttpsError("invalid-argument", "No 'id' was provided!");

  await moveToDeleted(TEMP_SESSION_REPORT_PATH.root, id);
  await removeRowFromSheet(
    SESSION_REPORT_SHEET_ID.value(),
    SESSION_REPORT_TAB_NAME.value(),
    SESSION_REPORT_TAB_ID.value(),
    id
  );

  return null;
});

export const isDuplicatedSessionReport = onCall(
  isDuplicatedSession(TEMP_SESSION_REPORT_PATH.root)
);

function dataToRow(
  id: string,
  {
    timestamp,
    teacher,
    student,
    date,
    status,
    notes,
    recitation,
    memorization,
    rules,
    otherRules,
  }: SessionReportData
) {
  return [
    id,
    dateTimeToCell(timestamp),
    dateToCell(date),
    teacher,
    student,
    status,
    chapterVersusCell(recitation),
    chapterVersusCell(memorization, true),
    rulesCell(rules, otherRules),
    notes,
    editLinkCell(id),
  ];
}
