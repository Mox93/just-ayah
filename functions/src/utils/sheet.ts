import { CountryCode, Timestamp, getCountry } from "@lib";
import { ChapterVersus, PhoneNumber } from "@types";

export function dateToCell(value?: Date | Timestamp) {
  return (
    value && value instanceof Timestamp ? value.toDate() : value
  )?.toLocaleDateString();
}

export function dateTimeToCell(value?: Date | Timestamp) {
  return (value && value instanceof Timestamp ? value.toDate() : value)
    ?.toLocaleString("en-US", { timeZone: "Africa/Cairo" })
    .replace(",", "");
}

export function booleanToCell(value?: boolean) {
  return value ? "TRUE" : "FALSE";
}

export function phoneNumberToCells(value?: PhoneNumber) {
  return [value?.number && `'${value?.number}`, value?.tags?.join(", ")];
}

export function countryToCell(value?: string) {
  const country = getCountry(value as CountryCode | undefined);
  return country ? `${country.name} - ${country.native}` : value;
}

export function hyperLinkCell(text: string, url: string) {
  return `=HYPERLINK("${url}","${text}")`;
}

export function editLinkCell(id: string, baseUrlCell = "$B$1") {
  return `=HYPERLINK(CONCAT(${baseUrlCell},"${id}"),"تعديل")`;
}

export function chapterVersusCell(
  value?: ChapterVersus[],
  noRating?: false
): string;
export function chapterVersusCell(
  value: Omit<ChapterVersus, "rating">[] | undefined,
  noRating: true
): string;
export function chapterVersusCell(
  value?: (Omit<ChapterVersus, "rating"> &
    Partial<Pick<ChapterVersus, "rating">>)[],
  noRating?: boolean
) {
  return (
    value
      ?.filter(({ chapter, from: _from, to }) => chapter && _from && to)
      .map(
        ({ chapter, from: _from, to, rating }) =>
          `${chapter}(${_from}-${to})` + (noRating ? "" : `[${rating}]`)
      )
      .join("، ") || ""
  );
}

export function rulesCell(rules?: string | string[], otherRules?: string) {
  return Array.isArray(rules)
    ? rules
        .map((value) => (value === "أخرى" ? `${value}(${otherRules})` : value))
        .join("، ")
    : rules;
}
