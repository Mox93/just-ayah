import { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";

import { languages } from "models/language";
import { cn } from "utils";

import "./style.scss";
import { useLanguage } from "utils/translation";

interface LanguageSelectorProps {}

const LanguageSelector: FunctionComponent<LanguageSelectorProps> = () => {
  const [language, setLanguage] = useLanguage();

  return (
    <div className="LanguageSelector">
      {Object.keys(languages).map((lng) => (
        <button
          key={lng}
          className={cn({ selected: language === lng }, [lng, "element"])}
          onClick={() => setLanguage(lng)}
        >
          {languages[lng].nativeName}
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;
