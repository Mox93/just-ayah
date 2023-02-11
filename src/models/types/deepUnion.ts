import { SetRequired, RequiredKeysOf } from "type-fest";

export type DeepUnion<T1 extends {}, T2 extends {}> = SetRequired<
  {
    [K in keyof T1 | keyof T2]?: K extends keyof T1
      ? K extends keyof T2
        ? T1[K] | T2[K]
        : T1[K]
      : K extends keyof T2
      ? T2[K]
      : never;
  },
  RequiredKeysOf<T1> | RequiredKeysOf<T2>
>;
