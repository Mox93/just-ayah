import { get, isEmpty, set } from "lodash";
import { Path } from "react-hook-form";

import { identity } from "utils";

import { paths } from "./object";

type MatchRecord<
  TFieldValues,
  TFieldName extends Path<TFieldValues> = Path<TFieldValues>
> = {
  [key in TFieldName]+?: { substrings: string[]; score: number };
};

interface MatchResult<TFieldValues> {
  value: TFieldValues;
  matches: MatchRecord<TFieldValues>;
  bestScore: number;
}

interface SubstringMatchOptions<TFieldName> {
  filter?: ["take" | "leave", TFieldName[]];
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
  <TFieldValues, TFieldName extends Path<TFieldValues> = Path<TFieldValues>>(
    indexData: TFieldValues[],
    { filter, substringMinLength = 1 }: SubstringMatchOptions<TFieldName> = {}
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

    const [filterType, fields] = filter || [];

    indexData.forEach((obj) => {
      const allFields: TFieldName[] = paths(obj, { includeAll: true });
      const IncludedFields =
        filterType === "take"
          ? fields!
          : filterType === "leave"
          ? allFields.filter((v) => !fields?.includes(v))
          : allFields;

      const matches: MatchRecord<TFieldValues> = {};
      let bestScore = 0;

      IncludedFields.forEach((field) => {
        const fieldValue = get(obj, field);
        const matchedSubstring =
          typeof fieldValue === "string"
            ? (fieldValue as string).toLowerCase().match(parts)
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

    return results.sort((a, b) => b.bestScore - a.bestScore);
  };
