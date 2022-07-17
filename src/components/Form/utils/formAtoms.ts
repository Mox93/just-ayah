import { FC, VFC } from "react";

import { Country } from "models/country";
import { fromDateInfo, toDateInfo } from "models/dateTime";
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
} from "./mappers";
import Textarea from "../Textarea";

const selectionInput = {
  Student: transformer(
    SelectionInput,
    formChild,
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
    InputGroup: transformer(InputGroup, formChild),

    // Single Field Components
    Input: transformer(
      Input,
      formChild,
      trimWhitespaceMod,
      processPropsMod,
      registerFieldMod
    ),
    Textarea: transformer(
      Textarea,
      formChild,
      trimWhitespaceMod,
      processPropsMod,
      registerFieldMod
    ),
    CountrySelectorInput: transformer(
      MenuInput as VFC<MenuInputProps<Country>>,
      formChild,
      processPropsMod,
      selectorMod,
      countryMapper,
      registerFieldMod
    ),
    TimezoneSelectorInput: transformer(
      MenuInput as VFC<MenuInputProps<Timezone>>,
      formChild,
      processPropsMod,
      selectorMod,
      timezoneMapper,
      registerFieldMod
    ),
    GovernorateSelectorInput: transformer(
      GovernorateSelectorInput,
      formChild,
      processPropsMod,
      governorateMapper<TFieldValues>(),
      registerFieldMod
    ),
    DateInput: transformer(
      DateInput,
      formChild,
      processPropsMod,
      selector<TFieldValues>({
        toValue: fromDateInfo,
        toSelected: toDateInfo,
      }),
      registerField<TFieldValues>((innerProps: any) => ({ innerProps }))
    ),

    // Nested Fields Components
    PhoneNumberInput: transformer(
      PhoneNumberInput,
      formChild,
      processPropsMod,
      phoneNumberMapper<TFieldValues>()
    ),

    // Generic Components
    SelectionInput: selectionInput,
  };
};

export default formAtoms;
