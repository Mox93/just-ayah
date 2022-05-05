export const yesNo = ["yes", "no"];

export const fromYesNo = <T extends any>(value: T) =>
  value === "yes" ? true : value === "no" ? false : value;

export const toYesNo = <T extends any>(value: T) =>
  value === true ? "yes" : value === false ? "no" : value;
