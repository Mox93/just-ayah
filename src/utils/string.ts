export const capitalize = (value: string) =>
  `${value.charAt(0).toUpperCase()}${value.slice(1)}`;

export const toTitle = (value: string) =>
  value.split(" ").map(capitalize).join(" ");
