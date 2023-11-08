import {
  DOC_ID_CARD,
  DOC_ID_VAR,
  STUDENT_RANGE_NAME,
  STUDENT_SHEET_ID,
  STUDENT_TAB_ID,
  STUDENT_TAB_NAME,
  TEMP_STUDENT_PATH,
} from "@config";
import { HttpsError, document, onCall } from "@lib";
import { addRowToSheet, changeRowInSheet, removeRowFromSheet } from "@services";
import { PhoneNumber } from "@types";
import {
  booleanToCell,
  countryToCell,
  dateTimeToCell,
  dateToCell,
  editLinkCell,
  hyperLinkCell,
  phoneNumberToCells,
  resolveGender,
  resolveGovernorate,
  resolveLead,
} from "@utils";
import { moveToDeleted } from "./utils";

export interface StudentData {
  name: string;
  gender: string;
  dateOfBirth: Date;
  nationality: string;
  country: string;
  governorate: string;
  phoneNumber: PhoneNumber[];
  email?: string;
  facebook?: string;
  education: string;
  job: string;
  quran: boolean;
  zoom: boolean;
  zoomTestSession: boolean;
  telegram: boolean;
  lead: string;
  leadOther?: string;
  termsOfService: string;
  timestamp: Date;
}

export const onStudentCreate = document(
  TEMP_STUDENT_PATH(DOC_ID_CARD)
).onCreate(async (snapshot, context) => {
  const id = context.params[DOC_ID_VAR];
  return await addRowToSheet(
    STUDENT_SHEET_ID.value(),
    STUDENT_RANGE_NAME.value(),
    dataToRow(id, snapshot.data() as StudentData)
  );
});

export const onStudentUpdate = document(
  TEMP_STUDENT_PATH(DOC_ID_CARD)
).onUpdate(async (snapshot, context) => {
  const id = context.params[DOC_ID_VAR];
  return await changeRowInSheet(
    STUDENT_SHEET_ID.value(),
    STUDENT_TAB_NAME.value(),
    id,
    dataToRow(id, snapshot.after.data() as StudentData)
  );
});

export const deleteStudent = onCall(async (data?: { id?: string }) => {
  const { id } = data || {};

  if (!id) throw new HttpsError("invalid-argument", "No 'id' was provided!");

  await moveToDeleted(TEMP_STUDENT_PATH.root, id);
  await removeRowFromSheet(
    STUDENT_SHEET_ID.value(),
    STUDENT_TAB_NAME.value(),
    STUDENT_TAB_ID.value(),
    id
  );

  return null;
});

function dataToRow(
  id: string,
  {
    name,
    gender,
    dateOfBirth,
    nationality,
    country,
    governorate,
    phoneNumber,
    email,
    education,
    job,
    quran,
    zoom,
    zoomTestSession,
    telegram,
    lead,
    leadOther,
    termsOfService,
    timestamp,
  }: StudentData
) {
  return [
    id,
    dateTimeToCell(timestamp),
    name,
    resolveGender(gender),
    dateToCell(dateOfBirth),
    countryToCell(nationality),
    countryToCell(country),
    resolveGovernorate(governorate),
    ...phoneNumberToCells(phoneNumber[0]),
    ...phoneNumberToCells(phoneNumber[1]),
    email,
    education,
    job,
    booleanToCell(quran),
    booleanToCell(zoom),
    booleanToCell(zoomTestSession),
    booleanToCell(telegram),
    resolveLead(lead),
    leadOther,
    hyperLinkCell("قبلت السياسات", termsOfService),
    editLinkCell(id),
  ];
}
