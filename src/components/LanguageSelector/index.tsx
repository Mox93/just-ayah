import { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";

import { languages } from "models/language";
import { cn } from "utils";

import "./style.scss";

interface LanguageSelectorProps {}

const LanguageSelector: FunctionComponent<LanguageSelectorProps> = () => {
  const { i18n } = useTranslation();

  return (
    <div className="LanguageSelector">
      {Object.keys(languages).map((lng) => (
        <button
          key={lng}
          className={cn({ selected: i18n.resolvedLanguage === lng }, [
            lng,
            "element",
          ])}
          onClick={() => i18n.changeLanguage(lng)}
        >
          {languages[lng].nativeName}
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;
