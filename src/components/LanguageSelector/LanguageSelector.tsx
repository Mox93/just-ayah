import { SelectionMenu } from "components/DropdownMenu";
import { OverflowDir, useLanguage } from "hooks";
import { Language, languages } from "models/blocks";

interface LanguageSelectorProps {
  dir?: string;
  overflowDir?: OverflowDir;
}

export default function LanguageSelector({
  dir,
  overflowDir = "start",
}: LanguageSelectorProps) {
  const [language, setLanguage] = useLanguage();

  return (
    <SelectionMenu
      className="LanguageSelector"
      dir={dir}
      overflowDir={overflowDir}
      options={Object.keys(languages) as Language[]}
      selected={language as Language}
      onOptionSelect={setLanguage}
      renderElement={(value) => (
        <span className={value}>{languages[value].nativeName}</span>
      )}
    />
  );
}
