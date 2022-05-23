import { FC, VFC } from "react";

import { Country } from "models/country";
import { CustomerInfo } from "models/customer";
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
  singleField,
  smartForm,
} from "./formModifiers";
import {
  countryMapper,
  governorateMapper,
  phoneNumberMapper,
  timezoneMapper,
} from "./mappers";

const autoCompleatInputMap = {
  //NOT USED
  Customer: transformer(
    MenuInput,
    formChild,
    processProps<CustomerInfo>(),
    selector<CustomerInfo>(),
    singleField<CustomerInfo>()
  ),
  //NOT USED
  Student: transformer(
    MenuInput,
    formChild,
    processProps<StudentInfo>(),
    selector<StudentInfo>(),
    singleField<StudentInfo>()
  ),
};

const selectionInput = {
  Student: transformer(
    SelectionInput,
    formChild,
    processProps<StudentInfo>(),
    singleField<StudentInfo>()
  ),
};

/**
 * TODO:
 *  - Investigate the possibility of using overload to pass a namespace and get back the correct type
 */

const formAtoms = <TFieldValues = any>() => {
  const singleFieldMod = singleField<TFieldValues>();
  const processPropsMod = processProps<TFieldValues>();
  const selectorMod = selector<TFieldValues>();

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
    Input: transformer(Input, formChild, processPropsMod, singleFieldMod),
    CountrySelectorInput: transformer(
      MenuInput as VFC<MenuInputProps<Country>>,
      formChild,
      processPropsMod,
      selectorMod,
      countryMapper,
      singleFieldMod
    ),
    TimezoneSelectorInput: transformer(
      MenuInput as VFC<MenuInputProps<Timezone>>,
      formChild,
      processPropsMod,
      selectorMod,
      timezoneMapper,
      singleFieldMod
    ),
    GovernorateSelectorInput: transformer(
      GovernorateSelectorInput,
      formChild,
      processPropsMod,
      governorateMapper<TFieldValues>(),
      singleFieldMod
    ),
    DateInput: transformer(
      DateInput,
      formChild,
      processPropsMod,
      selector<TFieldValues>({
        toValue: fromDateInfo,
        toSelected: toDateInfo,
      }),
      singleField<TFieldValues>((innerProps: any) => ({ innerProps }))
    ),

    // Nested Fields Components
    PhoneNumberInput: transformer(
      PhoneNumberInput,
      formChild,
      processPropsMod,
      phoneNumberMapper<TFieldValues>()
    ),

    // Generic Components
    OldAutoCompleatInput: autoCompleatInputMap,
    SelectionInput: selectionInput,
  };
};

export default formAtoms;
