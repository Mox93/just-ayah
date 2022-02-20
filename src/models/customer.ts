import { dateFromDB, DateInDB } from "models/dateTime";
import { PhoneNumberInfo } from "./phoneNumber";

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

interface MetaInDB extends Omit<Meta, "dateCreated" | "dateUpdated"> {
  dateCreated: DateInDB;
  dateUpdated: DateInDB;
}

export interface CustomerInfo {
  fullName: string;
  phoneNumber: PhoneNumberInfo;
  secondaryPhoneNumber?: PhoneNumberInfo[];
  facebookLink?: string;
}

export type CustomerValidation = {
  [K in keyof Required<CustomerInfo>]: boolean;
};

export const customerValidation: CustomerValidation = {
  fullName: false,
  phoneNumber: false,
  secondaryPhoneNumber: true,
  facebookLink: true,
};

export interface Customer extends CustomerInfo {
  id: string;
  meta: Meta;
}

export interface CustomerInDB extends Omit<Customer, "id" | "meta"> {
  dateOfBirth: DateInDB;
  meta: MetaInDB;
}

export const customerFromDB = (id: string, data: CustomerInDB): Customer => {
  return {
    ...data,
    id,
    meta: data.meta
      ? {
          ...data.meta,
          dateCreated: dateFromDB(data.meta.dateCreated),
          dateUpdated: dateFromDB(data.meta.dateUpdated),
        }
      : {
          dateCreated: new Date(),
          dateUpdated: new Date(),
          status: "registered",
        },
  };
};

export const customerFromInfo = (data: CustomerInfo): Omit<Customer, "id"> => {
  const now = new Date();
  return {
    ...data,
    meta: { dateCreated: now, dateUpdated: now, status: "registered" },
  };
};
