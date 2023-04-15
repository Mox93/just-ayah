import { FieldValues } from "react-hook-form";
import { FC, PropsWithChildren } from "react";

import { Country } from "models/blocks";
import { fromDateInfo, toDateInfo } from "models/_blocks";
import { Timezone, WeekDay } from "models/blocks";
import { StudentFormData } from "models/student";
import { TeacherFormData } from "models/teacher";
import { transformer } from "utils/transformer";

import {
  DateInput,
  Form,
  GovernorateSelectorInput,
  Input,
  InputGroup,
  MenuInput,
  MiniForm,
  PhoneNumberInput,
  SelectionInput,
  TermsOfService,
  Textarea,
  TimeInput,
} from "../";
import { MenuInputProps } from "../MenuInput";
import {
  formChild,
  processProps,
  menu,
  registerField,
  smartForm,
  trimWhitespace,
} from "./formModifiers";
import {
  countryMapper,
  governorateMapper,
  phoneNumberMapper,
  termsOfServiceMapper,
  timezoneMapper,
  weekDayMapper,
} from "./mappers";
import miniFormMapper from "./mappers/miniForm";

const selectionInput = {
  Student: formChild(
    SelectionInput,
    processProps<StudentFormData>(),
    registerField<StudentFormData>()
  ),
  Teacher: formChild(
    SelectionInput,
    processProps<TeacherFormData>(),
    registerField<TeacherFormData>()
  ),
} as const;

/**
// TODO:
 *  - Investigate the possibility of using overload to pass a namespace and get back the correct type
 */

export default function formAtoms<TFieldValues extends FieldValues>() {
  const registerFieldMod = registerField<TFieldValues>();
  const processPropsMod = processProps<TFieldValues>();
  const menuMod = menu<TFieldValues>();
  const trimWhitespaceMod = trimWhitespace<TFieldValues>();
  const smartFormMod = smartForm<TFieldValues>();

  return {
    // Wrapper Components
    Form: transformer(Form as FC<PropsWithChildren>, smartFormMod),
    MiniForm: transformer(
      MiniForm as FC<PropsWithChildren>,
      miniFormMapper,
      smartFormMod
    ),
    InputGroup: formChild(InputGroup),

    // Single Field Components
    Input: formChild(
      Input,
      trimWhitespaceMod,
      processPropsMod,
      registerFieldMod
    ),
    Textarea: formChild(
      Textarea,
      trimWhitespaceMod,
      processPropsMod,
      registerFieldMod
    ),
    CountrySelectorInput: formChild(
      MenuInput as FC<MenuInputProps<Country>>,
      processPropsMod,
      menuMod,
      countryMapper,
      registerFieldMod
    ),
    TimezoneSelectorInput: formChild(
      MenuInput as FC<MenuInputProps<Timezone>>,
      processPropsMod,
      menuMod,
      timezoneMapper,
      registerFieldMod
    ),
    GovernorateSelectorInput: formChild(
      GovernorateSelectorInput,
      processPropsMod,
      governorateMapper<TFieldValues>(),
      registerFieldMod
    ),
    DateInput: formChild(
      DateInput,
      processPropsMod,
      menu<TFieldValues>({
        toValue: fromDateInfo,
        toSelected: toDateInfo,
      }),
      registerFieldMod
    ),
    WeekDayInput: formChild(
      MenuInput as FC<MenuInputProps<WeekDay>>,
      processPropsMod,
      menuMod,
      weekDayMapper,
      registerFieldMod
    ),
    TimeInput: formChild(
      TimeInput,
      processPropsMod,
      menuMod,
      registerField<TFieldValues>((innerProps: any) => ({ innerProps }))
    ),
    TermsOfService: formChild(
      TermsOfService,
      processPropsMod,
      termsOfServiceMapper,
      registerFieldMod
    ),

    // Nested Fields Components
    PhoneNumberInput: formChild(
      PhoneNumberInput,
      processPropsMod,
      phoneNumberMapper<TFieldValues>()
    ),

    // Generic Components
    SelectionInput: selectionInput,
  };
}
