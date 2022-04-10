import { FieldPath, OrderByDirection, WhereFilterOp } from "firebase/firestore";

export const UNKNOWN = "unknown";

// UTILITY TYPES
export type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends { [P in K]: T[K] } ? never : K;
}[keyof T];

export type Merge<Obj1, Obj2> = Omit<Obj1, keyof Obj2> & Obj2;

// SERVER REQUEST TYPES
export type AddData<TData> = (
  data: TData,
  callback?: {
    onfulfilled?: (response: any) => void;
    onrejected?: (response: any) => void;
  }
) => void;

export type FetchData = (options?: {
  filters?: [string, WhereFilterOp, any][];
  size?: number;
  sort?: { by: string | FieldPath; direction?: OrderByDirection };
  callback?: {
    onfulfilled?: (response: any) => void;
    onrejected?: (response: any) => void;
  };
}) => void;

export type UpdateData<TData> = (
  id: string,
  updates: Partial<TData>,
  callback?: {
    onfulfilled?: () => void;
    onrejected?: (response: any) => void;
  }
) => void;

// Redeclare forwardRef
declare module "react" {
  function forwardRef<T, P = {}>(
    render: (props: P, ref: Ref<T>) => ReactElement | null
  ): (props: P & RefAttributes<T>) => ReactElement | null;
}
