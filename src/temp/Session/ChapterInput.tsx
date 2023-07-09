import { useEffect, useMemo } from "react";
import { useWatch } from "react-hook-form";

import {
  MenuInput as BaseMenuInput,
  InputGroup,
  formAtoms,
  formContextFactory,
} from "components/Form";
import { range } from "utils";
import { transformer } from "utils/transformer";

import { SessionReportData, useMetaData } from "../utils";

const {
  modifiers: { menuModifiers },
} = formAtoms<SessionReportData>();

const MenuInput = transformer(BaseMenuInput, ...menuModifiers);

const [, useFormContext] = formContextFactory<SessionReportData>();

interface ChapterInputProps {
  index: number;
  addItem: VoidFunction;
  removeItem: VoidFunction;
}

export default function ChapterInputRow({
  index,
  addItem,
  removeItem,
}: ChapterInputProps) {
  const CH = `recital.${index}.chapter` as const;
  const VF = `recital.${index}.from` as const;
  const VT = `recital.${index}.to` as const;

  const { courses } = useMetaData();

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
    if (versesFrom > versesTo) {
      resetField(VT, { defaultValue: "" });
    }
  }, [VT, resetField, versesFrom, versesTo]);

  useEffect(() => {
    resetField(VF, { defaultValue: "" });
    resetField(VT, { defaultValue: "" });
  }, [VF, VT, chapterName, resetField]);

  return (
    <InputGroup
      variant="dynamicListItem"
      addItem={addItem}
      removeItem={removeItem}
    >
      <MenuInput
        name={CH}
        options={chapters}
        {...(index === 0 ? { label: "السورة" } : { placeholder: "السورة" })}
      />
      <MenuInput
        name={VF}
        options={range(1, verses)}
        {...(index === 0 ? { label: "من الآية" } : { placeholder: "من الآية" })}
        disabled={!verses}
      />
      <MenuInput
        name={VT}
        options={range(versesFrom || 1, verses)}
        {...(index === 0
          ? { label: "إلى الآية" }
          : { placeholder: "إلى الآية" })}
        disabled={!verses}
      />
    </InputGroup>
  );
}
