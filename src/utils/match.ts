import { get, isEmpty } from "lodash";

import { Path } from "models";

import { applyFilters, Filter, identity, nestedPaths } from ".";

type MatchRecord<
  TFieldValues,
  TFieldName extends Path<TFieldValues> = Path<TFieldValues>
> = {
  [key in TFieldName]+?: { substrings: string[]; score: number };
};

export interface MatchResult<TFieldValues> {
  value: TFieldValues;
  matches: MatchRecord<TFieldValues>;
  score: number;
}

interface SubstringMatchOptions<TFieldValues> {
  filter?: Filter<TFieldValues>;
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

const calculateScore = (matchedSubstring: RegExpMatchArray) =>
  matchedSubstring.reduce(
    (score, match) => score + Math.pow(3, match.length),
    0
  );

export function substringMatch<TFieldValues>(
  indexData: TFieldValues[],
  { filter, substringMinLength = 2 }: SubstringMatchOptions<TFieldValues> = {}
) {
  return (searchKey: string) => {
    substringMinLength = Math.max(
      Math.min(substringMinLength, searchKey.length),
      1
    );
    const results: MatchResult<typeof indexData[number]>[] = [];

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
      const filteredObj = filter ? applyFilters(obj, filter) : obj;

      const fields = nestedPaths(filteredObj, { includeAll: true });
      const matches: MatchRecord<TFieldValues> = {};
      let score = 0;

      fields.forEach((field) => {
        const value = get(filteredObj, field);
        const matchedSubstring =
          typeof value === "string" && value.toLowerCase().match(parts);
        if (!matchedSubstring) return;
        const matchScore = calculateScore(matchedSubstring);
        if (matchScore > score) score = matchScore;
        matches[field] = { substrings: matchedSubstring, score };
      });
      if (!isEmpty(matches)) results.push({ value: obj, matches, score });
    });

    return results.sort((a, b) => b.score - a.score);
  };
}
