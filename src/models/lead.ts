import { Timestamp } from "firebase/firestore";
import { get, set } from "react-hook-form";

import { Merge } from "models";

import { filterPhoneNumberList, PhoneNumberList } from "./blocks";

const statuses = [
  "registered",
  "contacted",
  "postponed",
  "uninterested",
] as const;

type Status = typeof statuses[number];

interface Meta {
  dateCreated: Date;
  dateUpdated: Date;
  status: Status;
}

type MetaInDB = Merge<
  Meta,
  {
    dateCreated: Timestamp;
    dateUpdated: Timestamp;
  }
>;

export interface LeadInfo {
  fullName: string;
  phoneNumber: PhoneNumberList;
  facebook?: string;
  message?: string;
}

export interface Lead extends LeadInfo {
  id: string;
  meta: Meta;
}

export interface LeadInDB extends LeadInfo {
  meta: MetaInDB;
}

const defaultMeta = (): Meta => {
  const now = new Date();
  return { dateCreated: now, dateUpdated: now, status: "registered" };
};

export const leadFromDB = (
  id: string,
  { meta: { dateCreated, dateUpdated, ...meta }, ...data }: LeadInDB
): Lead => ({
  ...data,
  id,
  meta: {
    ...defaultMeta(),
    ...meta,
    ...(dateCreated && { dateCreated: dateCreated.toDate() }),
    ...(dateUpdated && { dateUpdated: dateUpdated.toDate() }),
  },
});

export const leadFromInfo = ({ fullName, phoneNumber, ...data }: LeadInfo) => {
  const processedData: Omit<Lead, "id"> = {
    fullName,
    phoneNumber: filterPhoneNumberList(phoneNumber),
    meta: defaultMeta(),
  };

  for (let key in data) {
    const value = get(data, key);
    if (value !== undefined) set(processedData, key, value);
  }

  console.log(processedData);

  return processedData;
};
