import { identity } from "./index";
import { useTranslation } from "react-i18next";

export const useNST = (ns: string) => {
  const { t } = useTranslation();
  return (value: string, options?: any) => t(`${ns}.${value}`, options);
};

export const useDirT = () => useTranslation().t("dir");
export const usePageT = (ns?: string) => useNST(append("pages", ns));
export const useGeneralT = (ns?: string) => useNST(append("general", ns));
export const useNavT = (ns?: string) => useNST(append("nav", ns));

const append = (...args: (string | undefined)[]): string =>
  args.filter(identity).join(".");
