import { SelectionMenu } from "components/DropdownMenu";
import { AnchorPoint, useLanguage } from "hooks";
import { Language, languages } from "models/blocks";

interface LanguageSelectorProps {
  dir?: string;
  anchorPoint?: AnchorPoint;
}

export default function LanguageSelector({
  dir,
  anchorPoint = "top-end",
}: LanguageSelectorProps) {
  const [language, setLanguage] = useLanguage();

  return (
    <SelectionMenu
      className="LanguageSelector"
      size="small"
      dir={dir}
      anchorPoint={anchorPoint}
      options={Object.keys(languages) as Language[]}
      selected={language as Language}
      onOptionChange={setLanguage}
      renderElement={(value) => (
        <span className={value}>{languages[value].nativeName}</span>
      )}
    />
  );
}
