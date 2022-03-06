import { identity } from "./index";
import { useTranslation } from "react-i18next";

export const useLanguage = (): [string, (lng: string) => void] => {
  const { i18n } = useTranslation();
  return [i18n.resolvedLanguage, i18n.changeLanguage];
};

/**Namespaced T */
export const useNST = (ns: string) => {
  const { t } = useTranslation();
  return (value: string, options?: any) => {
    const tIn = `${ns}.${value}`;
    const tOut = t(tIn, options);
    return tOut === tIn ? value : tOut;
  };
};

export const useDirT = () => useTranslation().t("dir");
export const usePageT = (ns?: string) => useNST(append("pages", ns));
export const useGlobalT = (ns?: string) => useNST(append("globals", ns));
export const useNavT = (ns?: string) => useNST(append("nav", ns));
export const useGovT = (ns?: string) => useNST(append("governorate", ns));
export const usePersonalInfoT = (ns?: string) =>
  useNST(append("personalInfo", ns));

const append = (...args: (string | undefined)[]): string =>
  args.filter(identity).join(".");
