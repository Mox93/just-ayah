import { get, set } from "react-hook-form";

import { Merge } from "models";
import { dateFromDB, DateInDB } from "models/dateTime";

import { filterPhoneNumberList, PhoneNumberList } from "./phoneNumber";

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
    dateCreated: DateInDB;
    dateUpdated: DateInDB;
  }
>;

export interface CustomerInfo {
  fullName: string;
  phoneNumber: PhoneNumberList;
  facebook?: string;
}

export interface Customer extends CustomerInfo {
  id: string;
  meta: Meta;
}

export interface CustomerInDB extends CustomerInfo {
  meta: MetaInDB;
}

const defaultMeta = (): Meta => {
  const now = new Date();
  return { dateCreated: now, dateUpdated: now, status: "registered" };
};

export const customerFromDB = (
  id: string,
  { meta: { dateCreated, dateUpdated, ...meta }, ...data }: CustomerInDB
): Customer => ({
  ...data,
  id,
  meta: {
    ...defaultMeta(),
    ...meta,
    ...(dateCreated && { dateCreated: dateFromDB(dateCreated) }),
    ...(dateUpdated && { dateUpdated: dateFromDB(dateUpdated) }),
  },
});

export const customerFromInfo = ({
  fullName,
  phoneNumber,
  ...data
}: CustomerInfo) => {
  const processedData: Omit<Customer, "id"> = {
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
