import { FieldPath, OrderByDirection, WhereFilterOp } from "firebase/firestore";
import { Ref } from "react";
import { Path, PathValue } from "react-hook-form";

import { Comment } from "./comment";

export const UNKNOWN = "unknown";

/***************************\
|****** UTILITY TYPES ******|
\***************************/

export type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends { [P in K]: T[K] } ? never : K;
}[keyof T];

export type Merge<Obj1, Obj2> = Omit<Obj1, keyof Obj2> & Obj2;

export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

export type UpdateObject<Obj> = { [path in Path<Obj>]?: PathValue<Obj, path> };

export type InnerProps<TProps, TElement = any> = Partial<TProps> & {
  ref?: Ref<TElement>;
};

export interface Filter<TFieldName> {
  type: "include" | "exclude";
  fields: [TFieldName, ...TFieldName[]];
}

/**********************************\
|****** SERVER REQUEST TYPES ******|
\**********************************/

type RequestCallback = {
  onFulfilled?: (response?: any) => void;
  onRejected?: (reason?: any) => void;
};

export type AddData<TData> = (data: TData, options?: RequestCallback) => void;

export type FetchData = (options?: {
  filters?: [string, WhereFilterOp, any][];
  size?: number;
  sort?: { by: string | FieldPath; direction?: OrderByDirection };
  options?: RequestCallback;
}) => void;

export type UpdateData<TData> = (
  id: string,
  updates: UpdateObject<TData>,
  options?: RequestCallback & { applyLocally?: boolean }
) => void;

export type GetData<TData> = (id: string) => Promise<TData | undefined>;

export type AddComment = (id: string, comment: Comment) => void;

/*********************************\
|****** FUNCTION DEFINITION ******|
\*********************************/

export type Converter<TInput, TOutput> = (obj: TInput) => TOutput;
export type GetKey<TInput> = Converter<TInput, string | number>;
export type DBConverter<DataFrom, DataTo> = {
  (id: string, data: DataFrom): DataTo & { id: string };
  (id: string, data: Partial<DataFrom>): Partial<DataTo> & { id: string };
};

/*********************************\
|****** JSON COMPATIBLE TYPES ******|
\*********************************/

export type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONObject
  | JSONArray;

export interface JSONObject {
  [x: string]: JSONValue;
}

export type JSONArray = Array<JSONValue>;

/***********************************\
|****** REDECLARE FORWARD-REF ******|
\***********************************/

declare module "react" {
  function forwardRef<T, P = {}>(
    render: (props: P, ref: Ref<T>) => ReactElement | null
  ): (props: P & RefAttributes<T>) => ReactElement | null;
}
