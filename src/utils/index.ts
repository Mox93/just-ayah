//
interface ConditionalClasses {
  [className: string]: boolean;
}

export const cn = (
  filteredClasses: ConditionalClasses,
  classNames: string | string[] = ""
): string =>
  `${Object.keys(filteredClasses)
    .filter((className) => filteredClasses[className])
    .join(" ")} ${
    typeof classNames === "string" ? classNames : classNames.join(" ")
  }`;

//
export const identity = (value: any) => value;

export const omit = () => {};

//
export const fromYesNo = (value?: string) =>
  value === "yes" ? true : value === "no" ? false : undefined;

export const toYesNo = (value?: boolean) =>
  value === true ? "yes" : value === false ? "no" : undefined;
