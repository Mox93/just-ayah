import { useWatch } from "react-hook-form";

import { MenuInput as BaseMenuInput, formAtoms } from "components/Form";
import { transformer } from "utils/transformer";

import { SessionReportData, useMetaData } from "../api";
import ChapterInput from "./ChapterInput";

const {
  Input,
  modifiers: { menuModifiers },
  useFormContext,
} = formAtoms<SessionReportData>();

const MenuInput = transformer(BaseMenuInput, ...menuModifiers);

export default function SessionReportFields() {
  const { recitationRules = [] } = useMetaData();

  const {
    formHook: { control },
  } = useFormContext();

  const rules = useWatch({ control, name: "rules" });

  return (
    <>
      <ChapterInput name="recitation" />
      <ChapterInput name="memorization" />
      <MenuInput
        name="rules"
        options={recitationRules}
        label="القواعد التجويدية المشروحة خلال اللقاء"
        required
        multiChoice
        rules={{ shouldUnregister: true }}
      />
      {rules?.includes("أخرى") ? (
        <Input
          name="otherRules"
          label="قواعد تجدويد أخرى"
          rules={{
            required: "ما هي قواعد التجويد الأخرى اللتي تم شرحها",
            shouldUnregister: true,
          }}
        />
      ) : null}
    </>
  );
}
