import { FC } from "react";

import { getCountryCode } from "models/country";
import { StudentInfo } from "models/student";
import { CustomerInfo } from "models/customer";
import { transformer } from "utils/transformer";

import AutoCompleatInput from "../AutoCompleatInput";
import CountrySelectorInput from "../CountrySelectorInput";
import Form, { FormProps } from "../Form";
import Input from "../Input";
import InputGroup from "../InputGroup";
import PhoneNumberInput from "../PhoneNumberInput";
import {
  formChild,
  phoneNumberMapper,
  processProps,
  selector,
  singleField,
} from "./formChild";

const autoCompleatInputMap = {
  Customer: transformer(
    AutoCompleatInput,
    formChild,
    processProps<CustomerInfo>(),
    selector<CustomerInfo>(),
    singleField<CustomerInfo>()
  ),
  Student: transformer(
    AutoCompleatInput,
    formChild,
    processProps<StudentInfo>(),
    selector<StudentInfo>(),
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
    Form: Form as FC<FormProps<TFieldValues>>,
    Input: transformer(Input, formChild, processPropsMod, singleFieldMod),
    InputGroup: transformer(InputGroup, formChild),
    PhoneNumberInput: transformer(
      PhoneNumberInput,
      formChild,
      processPropsMod,
      phoneNumberMapper<TFieldValues>()
    ),
    AutoCompleatInput: autoCompleatInputMap,
    CountrySelectorInput: transformer(
      CountrySelectorInput,
      formChild,
      processPropsMod,
      selector<TFieldValues>(getCountryCode),
      singleFieldMod
    ),
  };
};

export default formAtoms;
