import {
  MenuInput as BaseMenuInput,
  formAtoms,
  formContextFactory,
} from "components/Form";
import { transformer } from "utils/transformer";

import { SessionReportData, useMetaData } from "../api";
import ChapterInput from "./ChapterInput";

const {
  modifiers: { menuModifiers },
} = formAtoms<SessionReportData>();

const MenuInput = transformer(BaseMenuInput, ...menuModifiers);

const [, useFormContext] = formContextFactory<SessionReportData>();

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
      />
    </>
  );
}
