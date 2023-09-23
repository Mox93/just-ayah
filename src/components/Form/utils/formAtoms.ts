import { FC } from "react";

import { Country } from "models/blocks";
import { fromDateInfo, toDateInfo } from "models/_blocks";
import { Timezone, WeekDay } from "models/blocks";
import { singleton } from "utils";
import { transformer } from "utils/transformer";

import {
  DateInput,
  Form,
  GovernorateSelectorInput,
  Input,
  MenuInput,
  MiniForm,
  PhoneNumberInput,
  TermsOfService,
  Textarea,
  TimeInput,
} from "../";
import { MenuInputProps } from "../MenuInput";
import formContextFactory from "./formContext";
import formHookFactory from "./formHook";
import {
  processProps,
  menu,
  registerField,
  trimWhitespace,
} from "./formModifiers";
import {
  countryMapper,
  governorateMapper,
  miniFormMapper,
  phoneNumberMapper,
  termsOfServiceMapper,
  timezoneMapper,
  weekDayMapper,
} from "./modifiers";
import { formFamilyFactory } from "./modifiers";

/**
// TODO:
 *  - Investigate the possibility of using overload to pass a namespace and get back the correct type
 */

export default singleton(function formAtoms<T extends {}>() {
  const { formParent, formChild } = formFamilyFactory<T>();

  const registerFieldMod = registerField<T>();
  const processPropsMod = processProps<T>();
  const menuMod = menu<T>();
  const trimWhitespaceMod = trimWhitespace<T>();

  return {
    // Wrapper Components
    Form: transformer(Form, formParent),
    MiniForm: transformer(MiniForm, formParent, miniFormMapper),

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
      MenuInput as FC<MenuInputProps<Country>>,
      formChild,
      processPropsMod,
      menuMod,
      countryMapper,
      registerFieldMod
    ),
    TimezoneSelectorInput: transformer(
      MenuInput as FC<MenuInputProps<Timezone>>,
      formChild,
      processPropsMod,
      menuMod,
      timezoneMapper,
      registerFieldMod
    ),
    GovernorateSelectorInput: transformer(
      GovernorateSelectorInput,
      formChild,
      processPropsMod,
      governorateMapper<T>(),
      registerFieldMod
    ),
    DateInput: transformer(
      DateInput,
      formChild,
      processPropsMod,
      menu<T>({
        toValue: fromDateInfo,
        toSelected: toDateInfo,
      }),
      registerFieldMod
    ),
    WeekDayInput: transformer(
      MenuInput as FC<MenuInputProps<WeekDay>>,
      formChild,
      processPropsMod,
      menuMod,
      weekDayMapper,
      registerFieldMod
    ),
    TimeInput: transformer(
      TimeInput,
      formChild,
      processPropsMod,
      menuMod,
      registerField<T>((innerProps: any) => ({ innerProps }))
    ),
    TermsOfService: transformer(
      TermsOfService,
      formChild,
      processPropsMod,
      termsOfServiceMapper,
      registerFieldMod
    ),

    // Nested Fields Components
    PhoneNumberInput: transformer(
      PhoneNumberInput,
      formChild,
      processPropsMod,
      phoneNumberMapper<T>()
    ),

    // Form Hook
    useForm: formHookFactory<T>(),

    // Form Context
    useFormContext: formContextFactory<T>().useFormContext,

    // Modifiers
    modifiers: {
      defaultModifiers: [formChild, processPropsMod, registerFieldMod],
      menuModifiers: [formChild, processPropsMod, menuMod, registerFieldMod],
    },
  } as const;
});
