import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { useTitle } from "context";
import { useGlobalT, useLanguage } from "hooks";
import { subscribeEvents } from "utils";

export default function usePageSync() {
  // LANGUAGE
  const [language, setLanguage] = useLanguage();

  useEffect(
    () =>
      subscribeEvents(window, {
        storage: ({ key, newValue }) => {
          if (key === "i18nextLng" && newValue) setLanguage(newValue);
        },
      }),
    [setLanguage]
  );

  useEffect(() => {
    document.documentElement.setAttribute("lang", language);
  }, [language]);

  // DIR
  const { t } = useTranslation();
  const dir = t("dir");

  useEffect(() => {
    document.dir = dir;
  }, [dir]);

  // TITLE
  const title = useTitle();
  const glb = useGlobalT();

  useEffect(() => {
    const justAyah = glb("justAyah");
    document.title = justAyah + (title ? ` - ${title}` : "");

    return () => {
      document.title = justAyah;
    };
  }, [glb, title]);
}
