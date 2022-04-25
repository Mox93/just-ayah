import { forwardRef, Ref, useState } from "react";

import { timeZoneList, Timezone, getTzCode } from "models/timezone";

import AutoCompleatInput, {
  AutoCompleatInputProps,
} from "../AutoCompleatInput";
import { omit } from "utils";
import { renderAttributes } from "utils/render";

interface TimezoneSelectorInputProps extends AutoCompleatInputProps<Timezone> {
  renderSections?: (keyof Timezone)[];
}

const TimezoneSelectorInput = (
  {
    renderSections = ["label"],
    setValue = omit,
    ...props
  }: TimezoneSelectorInputProps,
  ref: Ref<HTMLInputElement>
) => {
  const [selected, setSelected] = useState<Timezone>();

  const renderElement = renderAttributes(...renderSections);

  const handleSelect = (value?: Timezone) => {
    setSelected(value);
    setValue(value);
  };

  return (
    <AutoCompleatInput
      {...props}
      ref={ref}
      options={timeZoneList}
      getKey={getTzCode}
      setValue={handleSelect}
      renderElement={renderElement}
      selected={renderElement(selected)}
    />
  );
};

export default forwardRef(TimezoneSelectorInput);
