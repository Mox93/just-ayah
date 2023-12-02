import { useEffect, useMemo } from "react";
import { ArrayPath, useWatch } from "react-hook-form";

import {
  MenuInput as BaseMenuInput,
  FormSection,
  InputGroup,
  formAtoms,
} from "components/Form";
import { useSessionT } from "hooks";
import { useFieldArray } from "lib/react-hook-form";
import { pass } from "utils";
import { transformer } from "utils/transformer";

import { SessionReportData, useMetaData } from "../api";

const {
  Input,
  modifiers: { menuModifiers },
  useFormContext,
} = formAtoms<SessionReportData>();

const MenuInput = transformer(BaseMenuInput, ...menuModifiers);

interface ChapterInputProps {
  name: ArrayPath<SessionReportData>;
}

export default function ChapterInput({ name }: ChapterInputProps) {
  const seT = useSessionT();

  const {
    formHook: { control },
  } = useFormContext();

  const { fields, insert, remove } = useFieldArray({
    name,
    control,
    emptyItem: {
      course: "",
      chapter: "",
      from: 0,
      to: 0,
      ...(name === "recitation" ? { rating: "" } : {}),
    },
  });

  return (
    <FormSection className="ChapterInput" title={seT(name)} compact isRequired>
      {fields.map(({ id }, index) => (
        <ChapterInputRow
          key={id}
          name={name}
          index={index}
          addItem={pass(insert, index + 1)}
          removeItem={pass(remove, index)}
        />
      ))}
    </FormSection>
  );
}

interface ChapterInputRowProps {
  name: ArrayPath<SessionReportData>;
  index: number;
  addItem: VoidFunction;
  removeItem: VoidFunction;
}

function ChapterInputRow({ name, index, ...props }: ChapterInputRowProps) {
  const CO = `${name}.${index}.course` as const;
  const CH = `${name}.${index}.chapter` as const;
  const VF = `${name}.${index}.from` as const;
  const VT = `${name}.${index}.to` as const;
  const RA = name === "recitation" ? (`${name}.${index}.rating` as const) : "";

  const { courses, recitationRating = [] } = useMetaData();

  const {
    formHook: { control, resetField },
  } = useFormContext();

  const course = useWatch({ control, name: CO });

  const courseList = useMemo(() => {
    if (!courses) return [];

    return Object.keys(courses).sort();
  }, [courses]);

  const chapters = useMemo(() => {
    if (!courses) return [];

    const chapterList: string[] = [];

    if (course)
      courses[course]?.forEach(
        ({ chapter, index }) => (chapterList[index - 1] = chapter)
      );
    else
      Object.values(courses).forEach((chapters) =>
        chapters.forEach(
          ({ chapter, index }) => (chapterList[index - 1] = chapter)
        )
      );

    return chapterList;
  }, [course, courses]);

  const [chapterName, versesFrom] = useWatch({
    name: [CH, VF, VT],
    control,
  });

  const verses = useMemo(() => {
    if (!courses) return 0;

    for (let chapters of Object.values(courses)) {
      for (let { chapter, verses } of chapters) {
        if (chapter === chapterName) return verses;
      }
    }

    return 0;
  }, [chapterName, courses]);

  useEffect(() => {
    if (!chapters.includes(chapterName))
      resetField(CH, { defaultValue: "", keepError: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapters]);

  useEffect(() => {
    resetField(VF, { defaultValue: chapterName ? 1 : "" });
    resetField(VT, { defaultValue: chapterName ? verses : "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterName]);

  return (
    <InputGroup variant="dynamicListItem" {...props}>
      <MenuInput
        name={CO}
        options={courseList}
        placeholder="البرنامج"
        noErrorMessage
      />
      <MenuInput
        name={CH}
        options={chapters}
        placeholder="السورة"
        rules={{ required: true }}
        noErrorMessage
      />
      <Input
        name={VF}
        // options={range(1, verses + 1)}
        placeholder="من الآية"
        rules={{ required: true, valueAsNumber: true, min: 1, max: verses }}
        noErrorMessage
      />
      <Input
        name={VT}
        // options={range(versesFrom || 1, verses + 1)}
        placeholder="إلى الآية"
        rules={{
          required: true,
          valueAsNumber: true,
          min: versesFrom || 1,
          max: verses,
        }}
        noErrorMessage
      />
      {RA ? (
        <MenuInput
          name={RA}
          options={recitationRating}
          placeholder="التقييم"
          rules={{ required: true }}
          noErrorMessage
        />
      ) : null}
    </InputGroup>
  );
}
