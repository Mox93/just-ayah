import { get, isEmpty, set } from "lodash";
import { FieldPath } from "react-hook-form";

import { identity } from "utils";

import { paths } from "./object";

type MatchRecord<
  TFieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  [key in TFieldName]+?: { substrings: string[]; score: number };
};

interface MatchResult<TFieldValues> {
  value: TFieldValues;
  matches: MatchRecord<TFieldValues>;
  bestScore: number;
}

interface SubstringMatchOptions<TFieldName> {
  fields?: { type: "include" | "exclude"; names: TFieldName[] };
  substringMinLength?: number;
}

const getUniqueSubstrings = (
  value: string,
  inRange = (a: number, b: number) => a < b
) => {
  const results = new Set<string>([value]);

  for (let i = 0; inRange(i, value.length); i++) {
    for (let j = value.length; inRange(i, j); j--) {
      const substring = value.slice(i, j);
      results.add(substring);
    }
  }

  return Array.from(results).filter(identity);
};

export const substringMatch =
  <
    TFieldValues,
    TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
  >(
    indexData: TFieldValues[],
    { fields, substringMinLength = 1 }: SubstringMatchOptions<TFieldName> = {}
  ) =>
  (searchKey: string) => {
    const results: MatchResult<TFieldValues>[] = [];

    const substrings = searchKey
      .toLowerCase()
      .split(" ")
      .reduce<string[]>(
        (array, word) => [
          ...array,
          ...getUniqueSubstrings(
            word.replace(/[^\p{L}\p{N}]+/gu, ""),
            (a, b) => a + substringMinLength <= b
          ),
        ],
        []
      );

    if (!substrings.length) return results;

    const parts = new RegExp(
      substrings.sort((a, b) => b.length - a.length).join("|"),
      "g"
    );

    indexData.forEach((obj) => {
      const allFields: TFieldName[] = paths(obj, { includeAll: true });
      const IncludedFields = fields
        ? fields.type === "include"
          ? fields.names
          : allFields.filter((v) => !fields.names.includes(v))
        : allFields;

      const matches: MatchRecord<TFieldValues> = {};
      let bestScore = 0;

      IncludedFields.forEach((field) => {
        const fieldValue = get(obj, field);
        const matchedSubstring =
          typeof fieldValue === "string"
            ? fieldValue.toLowerCase().match(parts)
            : null;

        if (!matchedSubstring) return;

        let score = matchedSubstring.reduce(
          (score, match) => score + Math.pow(3, match.length),
          0
        );

        if (score > bestScore) bestScore = score;

        set(matches, field, { substrings: matchedSubstring, score });
      });

      if (!isEmpty(matches)) results.push({ value: obj, matches, bestScore });
    });

    console.log("substringMatch", results);

    return results.sort((a, b) => b.bestScore - a.bestScore);
  };
