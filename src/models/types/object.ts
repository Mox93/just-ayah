export type NothingKeys<T extends {}, Ks = unknown> = Ks extends keyof T
  ? { [K in Exclude<keyof T, Ks>]+?: never }
  : { [K in keyof T]+?: never };

export type ThisOrNothing<T extends {}> = T | NothingKeys<T>;
