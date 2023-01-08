import type {
  FieldPath,
  OrderByDirection,
  WhereFilterOp,
} from "firebase/firestore";
import { Ref } from "react";
import { PartialDeep } from "type-fest";
import { z, ZodTypeAny } from "zod";

import { Comment } from "../blocks";
import { Path, PathValue } from "./path";

/******************************\
|****** PREDEFINED TYPES ******|
\******************************/

export const UNKNOWN = "unknown";

export type GenericObject = Record<PropertyKey, any>;

/***************************\
|****** UTILITY TYPES ******|
\***************************/

export type SchemaType<
  T extends { schema(): Record<string, ZodTypeAny> },
  K extends keyof ReturnType<T["schema"]>
> = z.infer<ReturnType<T["schema"]>[K]>;

export type Merge<Obj1, Obj2> = Omit<Obj1, keyof Obj2> & Obj2;

export type SubsetOf<T> = T | Partial<T> | PartialDeep<T>;

export type InnerProps<TProps, TElement = any> = Partial<TProps> & {
  ref?: Ref<TElement>;
};

export type UpdateObject<TData, TPath extends Path<TData> = Path<TData>> = {
  [path in TPath]+?: PathValue<TData, TPath>;
};

/**********************************\
|****** SERVER REQUEST TYPES ******|
\**********************************/

export interface FetchDataOptions<
  TData,
  TPath extends Path<TData> = Path<TData>
> extends RequestCallback {
  filters?: [TPath, WhereFilterOp, PathValue<TData, TPath>][];
  size?: number;
  sort?: { by: TPath | FieldPath; direction?: OrderByDirection };
}

interface RequestCallback {
  onFulfilled?: (...args: any[]) => void;
  onRejected?: (...args: any[]) => void;
}

interface LocalAction {
  applyLocally?: boolean;
}

interface CachingAction {
  fresh?: boolean;
  cache?: boolean;
}

export type AddData<TBase = unknown> = <TData extends TBase>(
  data: TData,
  options?: RequestCallback & LocalAction
) => void;

export type FetchData<TData> = (options?: FetchDataOptions<TData>) => void;

export type UpdateData<TData> = (
  id: string,
  updates: UpdateObject<TData>,
  options?: RequestCallback & LocalAction
) => void;

export type GetData<TData> = (
  id: string,
  options?: CachingAction
) => Promise<TData | undefined>;

export type DeleteData = (
  id: string,
  options?: RequestCallback & LocalAction
) => void;

export type AddComment = (id: string, comment: Comment) => void;

/*********************************\
|****** FUNCTION DEFINITION ******|
\*********************************/

export type Converter<TInput, TOutput = TInput> = (obj: TInput) => TOutput;
export type GetKey<TInput> = Converter<TInput, string | number>;
export type DBConverter<DataFrom, DataTo> = {
  (id: string, data: DataFrom): DataTo & { id: string };
  (id: string, data: Partial<DataFrom>): Partial<DataTo> & { id: string };
};
