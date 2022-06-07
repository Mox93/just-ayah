import { FieldPath, OrderByDirection, WhereFilterOp } from "firebase/firestore";
import { Ref } from "react";
import { Location } from "react-router-dom";

export const UNKNOWN = "unknown";

export interface LocationState {
  from?: Location;
}

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

export type InnerProps<TProps, TElement = any> = Partial<TProps> & {
  ref?: Ref<TElement>;
};

/**********************************\
|****** SERVER REQUEST TYPES ******|
\**********************************/

type RequestCallback = {
  onFulfilled?: (response?: any) => void;
  onRejected?: (reason?: any) => void;
};

export type AddData<TData> = (data: TData, callback?: RequestCallback) => void;

export type FetchData = (options?: {
  filters?: [string, WhereFilterOp, any][];
  size?: number;
  sort?: { by: string | FieldPath; direction?: OrderByDirection };
  callback?: RequestCallback;
}) => void;

export type UpdateData<TData> = (
  id: string,
  updates: Partial<TData>,
  callback?: RequestCallback
) => void;

/*********************************\
|****** FUNCTION DEFINITION ******|
\*********************************/

export type Converter<TInput, TOutput> = (obj: TInput) => TOutput;
export type GetKey<TInput> = Converter<TInput, string | number>;

/***********************************\
|****** REDECLARE FORWARD-REF ******|
\***********************************/

declare module "react" {
  function forwardRef<T, P = {}>(
    render: (props: P, ref: Ref<T>) => ReactElement | null
  ): (props: P & RefAttributes<T>) => ReactElement | null;
}
