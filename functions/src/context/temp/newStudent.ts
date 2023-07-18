import {
  DOC_ID_CARD,
  DOC_ID_VAR,
  STUDENT_RANGE_NAME,
  STUDENT_SHEET_ID,
  TEMP_STUDENT_PATH,
} from "@config";
import { document } from "@lib";
import { addRowToSheet } from "@services";
import { PhoneNumber } from "@types";
import {
  booleanToCell,
  dateTimeToCell,
  dateToCell,
  phoneNumberToCells,
} from "@utils";

export interface NewStudentData {
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

export const onNewStudentCreate = document(
  TEMP_STUDENT_PATH(DOC_ID_CARD)
).onCreate((snapshot, context) => {
  const id = context.params[DOC_ID_VAR];
  return addRowToSheet(
    STUDENT_SHEET_ID,
    STUDENT_RANGE_NAME,
    dataToRow(id, snapshot.data() as NewStudentData)
  );
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
  }: NewStudentData
) {
  return [
    id,
    dateTimeToCell(timestamp),
    name,
    gender,
    dateToCell(dateOfBirth),
    nationality,
    country,
    governorate,
    ...phoneNumberToCells(phoneNumber[0]),
    ...phoneNumberToCells(phoneNumber[1]),
    email,
    education,
    job,
    booleanToCell(quran),
    booleanToCell(zoom),
    booleanToCell(zoomTestSession),
    booleanToCell(telegram),
    lead,
    leadOther,
    termsOfService,
  ];
}
