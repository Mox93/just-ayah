import { FC, VFC } from "react";

import { Country } from "models/country";
import { fromDateInfo, toDateInfo, WeekDay, weekDays } from "models/dateTime";
import { StudentInfo } from "models/student";
import { Timezone } from "models/timezone";
import { transformer } from "utils/transformer";

import {
  DateInput,
  Form,
  GovernorateSelectorInput,
  Input,
  InputGroup,
  MenuInput,
  MenuInputProps,
  MiniForm,
  PhoneNumberInput,
  SelectionInput,
  TimeInput,
} from "../";
import {
  formChild,
  processProps,
  selector,
  registerField,
  smartForm,
  trimWhitespace,
} from "./formModifiers";
import {
  countryMapper,
  governorateMapper,
  phoneNumberMapper,
  timezoneMapper,
  weekDayMapper,
} from "./mappers";
import Textarea from "../Textarea";

const selectionInput = {
  Student: formChild(
    SelectionInput,
    processProps<StudentInfo>(),
    registerField<StudentInfo>()
  ),
};

/**
 * TODO:
 *  - Investigate the possibility of using overload to pass a namespace and get back the correct type
 */

const formAtoms = <TFieldValues = any>() => {
  const registerFieldMod = registerField<TFieldValues>();
  const processPropsMod = processProps<TFieldValues>();
  const selectorMod = selector<TFieldValues>();
  const trimWhitespaceMod = trimWhitespace<TFieldValues>();

  return {
    // Wrapper Components
    Form: transformer(Form as FC<{}>, smartForm<TFieldValues>()),
    MiniForm: transformer(
      MiniForm as FC<{}>,
      smartForm<TFieldValues>(
        ({
          formHook: {
            formState: { errors },
          },
        }) => ({
          isInvalid: Object.keys(errors || {}).length > 0,
        })
      )
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
      MenuInput as VFC<MenuInputProps<Country>>,
      processPropsMod,
      selectorMod,
      countryMapper,
      registerFieldMod
    ),
    TimezoneSelectorInput: formChild(
      MenuInput as VFC<MenuInputProps<Timezone>>,
      processPropsMod,
      selectorMod,
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
      selector<TFieldValues>({
        toValue: fromDateInfo,
        toSelected: toDateInfo,
      }),
      registerField<TFieldValues>((innerProps: any) => ({ innerProps }))
    ),
    WeekDayInput: formChild(
      MenuInput as VFC<MenuInputProps<WeekDay>>,
      processPropsMod,
      selector<TFieldValues>({ extraProps: () => ({ options: weekDays }) }),
      weekDayMapper,
      registerFieldMod
    ),
    TimeInput: formChild(
      TimeInput,
      processPropsMod,
      selectorMod,
      registerField<TFieldValues>((innerProps: any) => ({ innerProps }))
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
};

export default formAtoms;
