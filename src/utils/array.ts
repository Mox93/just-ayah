type Range = {
  (end: number): number[];
  (start: number, end: number, step?: number): number[];
};

export const range: Range = (startOrEnd, end?: number, step?: number) => {
  const [startAt, endAt] = end ? [startOrEnd, end] : [0, startOrEnd];
  const [endOfLoop, x] =
    startAt < endAt
      ? [(i: number) => i < endAt, step || 1]
      : [(i: number) => i > endAt, step ? (step > 0 ? -step : step) : -1];

  const output: number[] = [];

  for (let i = startAt; endOfLoop(i); i += x) {
    output.push(i);
  }

  return output;
};
