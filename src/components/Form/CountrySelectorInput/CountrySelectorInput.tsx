import { forwardRef, Ref, useState } from "react";

import { Country, countryList, getCountryCode } from "models/country";
import { renderAttributes } from "utils/render";

import AutoCompleatInput, {
  AutoCompleatInputProps,
} from "../AutoCompleatInput";
import { omit } from "utils";

export interface CountrySelectorInputProps
  extends AutoCompleatInputProps<Country> {
  renderSections: (keyof Country)[];
}

const CountrySelectorInput = (
  { renderSections, setValue = omit, ...props }: CountrySelectorInputProps,
  ref: Ref<HTMLInputElement>
) => {
  const [selected, setSelected] = useState<Country>();

  const renderElement = renderAttributes(
    ...renderSections.map((field) =>
      field === "phone" ? (obj: Country) => `+${obj["phone"]}` : field
    )
  );

  const handleSelect = (value?: Country) => {
    setSelected(value);
    setValue(value);
  };

  return (
    <AutoCompleatInput
      {...props}
      ref={ref}
      options={countryList}
      getKey={getCountryCode}
      setValue={handleSelect}
      renderElement={renderElement}
      selected={renderElement(selected)}
    />
  );
};

export default forwardRef(CountrySelectorInput);
