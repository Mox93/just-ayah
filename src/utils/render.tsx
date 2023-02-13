import { get } from "lodash";
import { ReactNode } from "react";

import { Path } from "models";

export type PathsOrConverters<TObject, TOutput = any> = (
  | Path<TObject>
  | ((obj: TObject) => TOutput | TOutput[])
)[];

export const renderAttributes =
  <TObject, TOutput = any>(
    pathsOrConverters: PathsOrConverters<TObject, TOutput>,
    mapper: (part: TOutput, index?: number) => ReactNode = (part, index) => (
      <p key={index}>{part}</p>
    )
  ) =>
  (obj?: TObject) => {
    if (!obj) return;

    const parts: any[] = [];

    pathsOrConverters.forEach((field) => {
      if (typeof field === "string") {
        const part = get(obj, field);
        if (part) parts.push(part);
      } else if (typeof field === "function") {
        const output = field(obj);
        parts.push(...(Array.isArray(output) ? output : [output]));
      }
    });

    return parts.map(mapper);
  };
