import type {
  FieldPath,
  FieldValue,
  OrderByDirection,
  UpdateData,
  WhereFilterOp,
} from "firebase/firestore";
import { Ref } from "react";
import { PartialDeep } from "type-fest";

import { Comment } from "../blocks";
import { DeepUnion } from "./deepUnion";
import { Path, PathValue } from "./path";

/******************************\
|****** PREDEFINED TYPES ******|
\******************************/

export const UNKNOWN = "unknown";
export const OTHER = "other";

export type GenericObject = Record<PropertyKey, any>;

export interface BaseModel<T extends GenericObject = GenericObject> {
  data: T;
}

export interface DataModel<T extends GenericObject = GenericObject>
  extends BaseModel<T> {
  id: string;
  update(updates: UpdateObject<T>): this;
}

/***************************\
|****** UTILITY TYPES ******|
\***************************/

export type SubsetOf<T> = T | Partial<T> | PartialDeep<T>;

export type InnerProps<TProps, TElement = any> = Partial<TProps> & {
  ref?: Ref<TElement>;
};

// FIXME returns unknown as value in nested objects
export type UpdateObject<TData> = { [K in Path<TData>]+?: PathValue<TData, K> };

export type UpdateDBObject<TData> = DeepUnion<
  UpdateObject<TData>,
  { [K in Path<TData>]+?: FieldValue }
>;

/**********************************\
|****** SERVER REQUEST TYPES ******|
\**********************************/

interface RequestCallback {
  onFulfilled?: (...args: any[]) => void;
  onRejected?: (...args: any[]) => void;
  onFailed?: (...args: any[]) => void;
  onCompleted?: () => void;
}

export interface FetchDataOptions<
  TData,
  TPath extends Path<TData> = Path<TData>
> extends RequestCallback {
  filters?: [TPath | FieldPath, WhereFilterOp, PathValue<TData, TPath>][];
  size?: number;
  sort?: { by: TPath | FieldPath; direction?: OrderByDirection };
}

interface LocalAction {
  applyLocally?: boolean;
}

interface CachingAction {
  fresh?: boolean;
  cache?: boolean;
}

export type AddDataFunc<TBase = unknown> = <TData extends TBase>(
  data: TData,
  options?: RequestCallback & LocalAction
) => void;

export type SetDataFunc<TData> = (
  id: string,
  data: TData,
  options?: RequestCallback & LocalAction
) => void;

export type FetchDataFunc<TData> = (options?: FetchDataOptions<TData>) => void;

export type UpdateDataFunc<TData> = (
  id: string,
  updates: UpdateData<TData>,
  options?: RequestCallback & LocalAction
) => void;

export type GetDataFunc<TData> = (
  id: string,
  options?: CachingAction
) => Promise<TData | undefined>;

export type DeleteDataFunc = (
  id: string,
  options?: RequestCallback & LocalAction
) => void;

export type AddCommentFunc = (id: string, comment: Comment) => void;

/*********************************\
|****** FUNCTION DEFINITION ******|
\*********************************/

export type Converter<TInput, TOutput = TInput> = (obj: TInput) => TOutput;
export type GetKey<TInput> = Converter<TInput, string | number>;
export type DBConverter<DataFrom, DataTo> = {
  (id: string, data: DataFrom): DataTo & { id: string };
  (id: string, data: Partial<DataFrom>): Partial<DataTo> & { id: string };
};
