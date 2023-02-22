import { useLanguage } from "hooks";
import { languages } from "models/blocks";
import { cn, pass } from "utils";

export default function LanguageSelector() {
  const [language, setLanguage] = useLanguage();

  return (
    <div className="LanguageSelector">
      {Object.keys(languages).map((lng) => (
        <button
          key={lng}
          className={cn({ selected: language === lng }, lng, "element")}
          onClick={pass(setLanguage, lng)}
        >
          {languages[lng].nativeName}
        </button>
      ))}
    </div>
  );
}
