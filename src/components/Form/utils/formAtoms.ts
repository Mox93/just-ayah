import { FC } from "react";

import { getCountryCode } from "models/country";
import { CustomerInfo } from "models/customer";
import { getDate } from "models/dateTime";
import { StudentInfo } from "models/student";
import { getTzCode } from "models/timezone";
import { transformer } from "utils/transformer";

import {
  AutoCompleatInput,
  CountrySelectorInput,
  DateInput,
  Form,
  GovernorateSelectorInput,
  Input,
  InputGroup,
  PhoneNumberInput,
  SelectionInput,
  TimezoneSelectorInput,
} from "../";
import {
  formChild,
  GovernorateMapper,
  phoneNumberMapper,
  processProps,
  selector,
  singleField,
  smartForm,
} from "./formModifiers";

const autoCompleatInputMap = {
  //NOT USED
  Customer: transformer(
    AutoCompleatInput,
    formChild,
    processProps<CustomerInfo>(),
    selector<CustomerInfo>(),
    singleField<CustomerInfo>()
  ),
  //NOT USED
  Student: transformer(
    AutoCompleatInput,
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

const formAtoms = <TFieldValues>() => {
  const singleFieldMod = singleField<TFieldValues>();
  const processPropsMod = processProps<TFieldValues>();

  return {
    // Wrapper Components
    Form: transformer(Form as FC<{}>, smartForm<TFieldValues>()),
    InputGroup: transformer(InputGroup, formChild),

    // Single Field Components
    Input: transformer(Input, formChild, processPropsMod, singleFieldMod),
    CountrySelectorInput: transformer(
      CountrySelectorInput,
      formChild,
      processPropsMod,
      selector<TFieldValues>(getCountryCode),
      singleFieldMod
    ),
    TimezoneSelectorInput: transformer(
      TimezoneSelectorInput,
      formChild,
      processPropsMod,
      selector<TFieldValues>(getTzCode),
      singleFieldMod
    ),
    GovernorateSelectorInput: transformer(
      GovernorateSelectorInput,
      formChild,
      processPropsMod,
      GovernorateMapper<TFieldValues>(),
      singleFieldMod
    ),
    DateInput: transformer(
      DateInput,
      formChild,
      processPropsMod,
      selector<TFieldValues>(getDate),
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
    AutoCompleatInput: autoCompleatInputMap,
    SelectionInput: selectionInput,
  };
};

export default formAtoms;
