import { useCallback } from "react";

import { MenuInput as BaseMenuInput, formAtoms } from "components/Form";
import { formChild } from "components/Form/utils/formModifiers";

import { SessionReportData, menuModifiers, useMetaData } from "./utils";
import { range } from "utils";

const MenuInput = formChild(
  BaseMenuInput,
  ...menuModifiers<SessionReportData>()
);

const { FormFragment, InputGroup, DateInput } = formAtoms<SessionReportData>();

interface SessionReportFieldsProps {}

export default formChild(function SessionReportFields({
  ...props
}: SessionReportFieldsProps) {
  const { courses } = useMetaData();

  const getChapter = useCallback<() => string[]>(
    () =>
      courses
        ? [
            ...new Set(
              Object.values(courses).flatMap((chapters) =>
                chapters.map(({ chapter }) => chapter)
              )
            ),
          ]
        : [],
    [courses]
  );

  return (
    <FormFragment {...props}>
      <DateInput name="date" />
      <InputGroup>
        <MenuInput
          name="recital.0.chapter"
          options={getChapter}
          label="السورة"
        />
        <MenuInput
          name="recital.0.from"
          options={range(200)}
          label="من الآية"
        />
        <MenuInput name="recital.0.to" options={range(200)} label="إلى الآية" />
      </InputGroup>
    </FormFragment>
  );
});
