export const languages: { [id: string]: { nativeName: string } } = {
  ar: { nativeName: "ع" },
  en: { nativeName: "En" },
} as const;

export type Languages = keyof typeof languages;
