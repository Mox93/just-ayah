import { FieldValues } from "react-hook-form";
import { FC, VFC } from "react";

import {
  Country,
  fromDateInfo,
  Timezone,
  toDateInfo,
  WeekDay,
  weekDays,
} from "models/blocks";
import { StudentInfo } from "models/student";
import { TeacherInfo } from "models/teacher";
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
  timezoneMapper,
  weekDayMapper,
} from "./mappers";

const selectionInput = {
  Student: formChild(
    SelectionInput,
    processProps<StudentInfo>(),
    registerField<StudentInfo>()
  ),
  Teacher: formChild(
    SelectionInput,
    processProps<TeacherInfo>(),
    registerField<TeacherInfo>()
  ),
};

/**
 * TODO:
 *  - Investigate the possibility of using overload to pass a namespace and get back the correct type
 */

const formAtoms = <TFieldValues extends FieldValues>() => {
  const registerFieldMod = registerField<TFieldValues>();
  const processPropsMod = processProps<TFieldValues>();
  const menuMod = menu<TFieldValues>();
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
      menuMod,
      countryMapper,
      registerFieldMod
    ),
    TimezoneSelectorInput: formChild(
      MenuInput as VFC<MenuInputProps<Timezone>>,
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
      registerField<TFieldValues>((innerProps: any) => ({ innerProps }))
    ),
    WeekDayInput: formChild(
      MenuInput as VFC<MenuInputProps<WeekDay>>,
      processPropsMod,
      menu<TFieldValues>({ extraProps: () => ({ options: weekDays }) }),
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
      processProps<TFieldValues>(
        ({ isRequired, rules: { required, ...rules } = {}, ...props }) => {
          const { name, formHook: { setValue } = {} } = props;
          return {
            ...props,
            rules: { required: required || true, ...rules },
            noErrorMessage: true,
            onAccept: (url: string) => setValue?.(name as any, url as any),
          };
        }
      ),
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
};

export default formAtoms;
