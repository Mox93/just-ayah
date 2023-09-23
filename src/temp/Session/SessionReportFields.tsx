import { MenuInput as BaseMenuInput, formAtoms } from "components/Form";
import { transformer } from "utils/transformer";

import { SessionReportData, useMetaData } from "../api";
import ChapterInput from "./ChapterInput";

const {
  modifiers: { menuModifiers },
  useFormContext,
} = formAtoms<SessionReportData>();

const MenuInput = transformer(BaseMenuInput, ...menuModifiers);

export default function SessionReportFields() {
  const { recitationRules = [] } = useMetaData();

  const {
    formHook: { control },
  } = useFormContext();

  return (
    <>
      <ChapterInput control={control} name="recitation" />
      <ChapterInput control={control} name="memorization" />
      <MenuInput
        name="rules"
        options={recitationRules}
        label="القواعد التجويدية المشروحة خلال اللقاء"
        required
        multiChoice
        rules={{ shouldUnregister: true }}
      />
    </>
  );
}
