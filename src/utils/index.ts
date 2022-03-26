//
export const identity = (value: any) => value;

export const omit = () => {};

//
export const fromYesNo = (value?: string) =>
  value === "yes" ? true : value === "no" ? false : undefined;

export const toYesNo = (value?: boolean) =>
  value === true ? "yes" : value === false ? "no" : undefined;
