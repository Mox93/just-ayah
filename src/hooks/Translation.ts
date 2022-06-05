import { Callback, TFunction } from "i18next";
import { useTranslation } from "react-i18next";

import { identity } from "utils";

export const useLanguage = (): [
  string,
  (lng?: string, callback?: Callback) => Promise<TFunction>
] => {
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

const createHook = (root: string) => (ns?: string) =>
  useNST([root, ns].filter(identity).join("."));

export const useDirT = () => useTranslation().t("dir");
export const usePageT = createHook("pages");
export const useGlobalT = createHook("globals");
export const useNavT = createHook("nav");
export const useGovT = createHook("governorate");
export const usePersonalInfoT = createHook("personalInfo");
export const useMessageT = createHook("messages");
export const useDateTimeT = createHook("dateTime");
