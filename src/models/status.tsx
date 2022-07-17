import { Timestamp } from "firebase/firestore";

import { formAtoms } from "components/Form";
import { identity } from "utils";

import { shortDateRep } from "./dateTime";

const { Input, DateInput } = formAtoms();

/****************************\
|****** Generic Status ******|
\****************************/

export type Status<T = any> = { type: string; value?: T };

/************************\
|****** Status Map ******|
\************************/

const statusMap = {
  progress: [
    "pending",
    "active",
    {
      name: "postponed",
      type: "date",
      default: () => new Date(),
      fromDB: (date: Timestamp) => date.toDate(),
      convert: shortDateRep,
      field: (
        <DateInput
          name="postponed"
          className="statusField"
          yearsRange={{
            start: new Date().getFullYear(),
            end: new Date().getFullYear() + 10,
          }}
          rules={{
            required: true,
            validate: (v) => {
              const date = new Date(v);
              const now = new Date();
              now.setHours(0, 0, 0, 0);

              console.log({ date, now });

              return date.getTime() >= now.getTime();
            },
          }}
        />
      ),
    },
    "finished",
    "canceled",
  ],
  subscription: [
    "fullPay",
    {
      name: "partialPay",
      type: "number",
      default: () => 90,
      field: (
        <Input
          name="partialPay"
          className="statusField"
          type="number"
          rules={{
            required: true,
            valueAsNumber: true,
            validate: (v) => v > 0,
          }}
        />
      ),
    },
    "noPay",
  ],
} as const;

type StatusMap = {
  [key in keyof typeof statusMap]: typeof statusMap[key][number];
};

export type StatusVariants = keyof StatusMap;

export type StatusTypes = { [key in StatusVariants]: StatusObject<key> };

type PickCustomStatus<TStatus> = TStatus extends Record<string, any>
  ? TStatus
  : never;

type CustomStatus = {
  [key in StatusVariants]: PickCustomStatus<StatusMap[key]>;
};

type CustomValues = {
  date: { app: Date; db: Timestamp };
  number: { app: number };
};

type StatusObject<
  TName extends StatusVariants,
  TLocation extends keyof CustomValues[CustomStatus[TName]["type"]] = "app",
  TStatus extends StatusMap[TName] = StatusMap[TName]
> = TStatus extends Record<string, any>
  ? { type: TStatus["name"]; value: CustomValues[TStatus["type"]][TLocation] }
  : { type: TStatus };

/*****************************\
|****** Status Variants ******|
\*****************************/

export type Progress = StatusObject<"progress">;
export type ProgressInDB = StatusObject<"progress", "db">;

export type Subscription = StatusObject<"subscription">;

/*********************\
|****** Getters ******|
\*********************/

export const getCustomStatus = <TVariant extends StatusVariants>(
  variant: TVariant,
  name: string
): CustomStatus[TVariant] | undefined =>
  (statusMap[variant] as any).find((status: any) => status.name === name);

export const getStatus = <TVariant extends StatusVariants>(
  variant: TVariant,
  status?: Status,
  converter: string = "fromDB"
): StatusTypes[TVariant] | undefined => {
  if (!status) return;

  const { type, value } = status;
  const customStatus: any = getCustomStatus(variant, type);
  const convert = customStatus?.[converter] || identity;
  const defaultValue = customStatus?.default;

  return {
    type,
    ...(value
      ? { value: convert(value) }
      : defaultValue && { value: defaultValue() }),
  };
};

/*********************\
|****** Mappers ******|
\*********************/

export const mapStatusVariant = <TOutput extends any = StatusVariants>(
  convert: (variant: StatusVariants) => TOutput = identity
): TOutput[] =>
  Object.keys(statusMap).map((variant) => convert(variant as StatusVariants));

export const mapStatusType = <
  TVariant extends StatusVariants,
  TOutput = StatusTypes[TVariant]
>(
  variant: TVariant,
  convert: (status: StatusTypes[TVariant]) => TOutput = identity
): TOutput[] =>
  statusMap[variant].map((status) =>
    convert(
      (typeof status === "string"
        ? { type: status }
        : {
            type: status.name,
            value: status.default(),
          }) as StatusTypes[TVariant]
    )
  );

export const mapStatusString = <TVariant extends StatusVariants>(
  variant: TVariant,
  status?: Status,
  convert: { type?: Function; value?: Function } = {}
): string[] => {
  if (!status) return [];

  const { type, value } = status;
  const customStatus: any = getCustomStatus(variant, type);
  const valueToString = customStatus?.convert || ((v: any) => `${v}`);
  const { type: convertT = identity, value: convertV = valueToString } =
    convert;

  const parts = [
    ...(type ? [convertT(type)] : []),
    ...(value !== undefined ? [convertV(value)] : []),
  ];

  return parts;
};
