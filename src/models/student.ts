import { get, set } from "react-hook-form";

import { Merge } from "models";
import { dateFromDB, DateInDB } from "models/dateTime";

import { CountryCode } from "./country";
import { Gender } from "./gender";
import { Note, NoteMapInDB, noteListFromDB } from "./note";
import { filterPhoneNumberList, PhoneNumberList } from "./phoneNumber";
import {
  StudentStatus,
  studentStatusFromDB,
  StudentStatusInDB,
} from "./studentStatus";
import { Subscription } from "./subscription";
import { parseWorkStatus, WorkStatus } from "./work";
import { fromYesNo } from "../utils/yesNo";

interface Meta {
  dateCreated: Date;
  dateUpdated: Date;
  status?: StudentStatus;
  subscription?: Subscription;
}

type MetaInDB = Merge<
  Meta,
  {
    dateCreated: DateInDB;
    dateUpdated: DateInDB;
    status: StudentStatusInDB;
  }
>;

export interface StudentInfo {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: Gender;
  nationality: CountryCode;
  country: CountryCode;
  governorate?: string;
  timezone: string;
  phoneNumber: PhoneNumberList;
  email?: string;
  facebook?: string;
  education: string;
  workStatus: WorkStatus;
  Quran: boolean;
  Zoom: boolean;
}

export interface Student extends StudentInfo {
  id: string;
  meta: Meta;
  notes?: Note[];
}

export type StudentInDB = Merge<
  StudentInfo,
  {
    dateOfBirth: DateInDB;
    meta: MetaInDB;
    notes?: NoteMapInDB;
  }
>;

const defaultMeta = (): Meta => {
  const now = new Date();
  return { dateCreated: now, dateUpdated: now, status: { type: "pending" } };
};

export const studentFromDB = (
  id: string,
  {
    dateOfBirth,
    notes,
    meta: { dateCreated, dateUpdated, status, ...meta },
    ...data
  }: StudentInDB
): Student => {
  const now = new Date();

  return {
    ...data,
    id,
    dateOfBirth: dateFromDB(dateOfBirth),
    meta: {
      ...meta,
      dateCreated: dateCreated ? dateFromDB(dateCreated) : now,
      dateUpdated: dateUpdated ? dateFromDB(dateUpdated) : now,
      ...(status && { status: studentStatusFromDB(status) }),
    },
    notes: notes && noteListFromDB(notes),
  };
};

export const studentFromInfo = ({
  phoneNumber,
  dateOfBirth,
  governorate,
  email,
  facebook,
  workStatus,
  Quran,
  Zoom,
  ...data
}: StudentInfo) => {
  const processedData: Omit<Student, "id"> = {
    ...data,
    dateOfBirth: new Date(dateOfBirth),
    phoneNumber: filterPhoneNumberList(phoneNumber),
    workStatus: parseWorkStatus(workStatus),
    Quran: fromYesNo(Quran),
    Zoom: fromYesNo(Zoom),
    meta: defaultMeta(),
  };

  const optionalData = { governorate, email, facebook };

  for (let key in optionalData) {
    const value = get(optionalData, key);
    if (value !== undefined) set(processedData, key, value);
  }

  console.log(processedData);

  return processedData;
};
