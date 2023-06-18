import { MenuInput as BaseMenuInput, formAtoms } from "components/Form";
import { formContextFactory } from "components/Form/utils";
import { transformer } from "utils/transformer";

import { SessionReportData, useMetaData } from "./utils";
import { pass } from "utils";
import { useFieldArray } from "lib/react-hook-form";

const {
  modifiers: { menuModifiers },
} = formAtoms<SessionReportData>();

const MenuInput = transformer(BaseMenuInput, ...menuModifiers);

const [, useFormContext] = formContextFactory<SessionReportData>();

export default function SessionReportFields() {
  const { courses } = useMetaData();

  const {
    formHook: { control },
  } = useFormContext();

  const { fields, insert, remove } = useFieldArray({
    name: "recital",
    control,
    emptyItem: { chapter: "", from: 0, to: 0, rating: "" },
  });

  return (
    <>
      {fields.map(({ id }, index) => (
        <div key={id} />
      ))}
    </>
  );
}
