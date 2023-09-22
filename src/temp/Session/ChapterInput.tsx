import { useEffect, useMemo } from "react";
import { ArrayPath, Control, useWatch } from "react-hook-form";

import {
  MenuInput as BaseMenuInput,
  FormSection,
  InputGroup,
  formAtoms,
  formContextFactory,
} from "components/Form";
import { useSessionT } from "hooks";
import { useFieldArray } from "lib/react-hook-form";
import { pass, range } from "utils";
import { transformer } from "utils/transformer";

import { SessionReportData, useMetaData } from "../api";

const {
  modifiers: { menuModifiers },
} = formAtoms<SessionReportData>();

const MenuInput = transformer(BaseMenuInput, ...menuModifiers);

const [, useFormContext] = formContextFactory<SessionReportData>();

interface ChapterInputProps {
  control: Control<SessionReportData>;
  name: ArrayPath<SessionReportData>;
}

export default function ChapterInput({ control, name }: ChapterInputProps) {
  const seT = useSessionT();

  const { fields, insert, remove } = useFieldArray({
    name,
    control,
    emptyItem: {
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

function ChapterInputRow({
  name,
  index,
  addItem,
  removeItem,
}: ChapterInputRowProps) {
  const CH = `${name}.${index}.chapter` as const;
  const VF = `${name}.${index}.from` as const;
  const VT = `${name}.${index}.to` as const;
  const RA = name === "recitation" ? (`${name}.${index}.rating` as const) : "";

  const { courses, recitationRating = [] } = useMetaData();

  const chapters = useMemo(() => {
    if (!courses) return [];

    const resultSet = new Set<string>();

    Object.values(courses).forEach((chapters) =>
      chapters.forEach(({ chapter }) => resultSet.add(chapter))
    );

    return [...resultSet].sort();
  }, [courses]);

  const {
    formHook: { control, resetField },
  } = useFormContext();

  const [chapterName, versesFrom, versesTo] = useWatch({
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
    if (versesFrom > verses)
      resetField(VF, { defaultValue: "", keepError: true });
    if (versesTo > verses || versesFrom > versesTo)
      resetField(VT, { defaultValue: "", keepError: true });
  }, [VF, VT, chapterName, resetField, verses, versesFrom, versesTo]);

  return (
    <InputGroup
      variant="dynamicListItem"
      addItem={addItem}
      removeItem={removeItem}
    >
      <MenuInput
        name={CH}
        options={chapters}
        placeholder="السورة"
        required={index === 0}
        noErrorMessage
      />
      <MenuInput
        name={VF}
        options={range(1, verses + 1)}
        placeholder="من الآية"
        disabled={!verses}
        required={index === 0}
      />
      <MenuInput
        name={VT}
        options={range(versesFrom || 1, verses + 1)}
        placeholder="إلى الآية"
        disabled={!verses}
        required={index === 0}
      />
      {RA ? (
        <MenuInput
          name={RA}
          options={recitationRating}
          placeholder="التقييم"
          disabled={!verses}
          required={index === 0}
        />
      ) : null}
    </InputGroup>
  );
}
