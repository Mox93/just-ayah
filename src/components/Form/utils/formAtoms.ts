import { FC } from "react";

import { StudentInfo } from "models/student";
import { CustomerInfo } from "models/customer";
import { transformer } from "utils/transformer";

import AutoCompleatInput from "../AutoCompleatInput";
import Form, { FormProps } from "../Form";
import Input from "../Input";
import InputGroup from "../InputGroup";
import PhoneNumberInput from "../PhoneNumberInput";
import {
  complexChild,
  formChild,
  processProps,
  simpleChild,
} from "./formChild";

const AutoCompleatInputMap = {
  Customer: transformer(
    AutoCompleatInput,
    formChild,
    processProps<CustomerInfo>(),
    simpleChild<CustomerInfo>()
  ),
  Student: transformer(
    AutoCompleatInput,
    formChild,
    processProps<StudentInfo>(),
    simpleChild<StudentInfo>()
  ),
};

/**
 * TODO:
 *  - Investigate the possibility of using overload to pass a namespace and get back the correct type
 */

const formAtoms = <TFieldValues>() => {
  const applyRegisterMod = simpleChild<TFieldValues>();
  const complexChildMod = complexChild<TFieldValues>();
  const processPropsMod = processProps<TFieldValues>();

  return {
    Form: Form as FC<FormProps<TFieldValues>>,
    Input: transformer(Input, formChild, processPropsMod, applyRegisterMod),
    InputGroup: transformer(InputGroup, formChild),
    PhoneNumberInput: transformer(
      PhoneNumberInput,
      formChild,
      processPropsMod,
      complexChildMod
    ),
    AutoCompleatInput: AutoCompleatInputMap,
  };
};

export default formAtoms;
