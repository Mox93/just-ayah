import { SetRequired, RequiredKeysOf, OptionalKeysOf } from "type-fest";

export type Merge<T1 extends {}, T2 extends {}> = SetRequired<
  {
    [K in keyof T1 | keyof T2]?: K extends keyof T2
      ? T2[K]
      : K extends keyof T1
      ? T1[K]
      : never;
  },
  RequiredKeysOf<T2> | Exclude<RequiredKeysOf<T1>, OptionalKeysOf<T2>>
>;
