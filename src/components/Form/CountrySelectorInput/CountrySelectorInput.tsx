import { forwardRef, Ref, useState } from "react";

import { Country, countryList, getCountryCode } from "models/country";
import { renderAttributes } from "utils/render";

import AutoCompleatInput, {
  AutoCompleatInputProps,
} from "../AutoCompleatInput";
import { omit } from "utils";

interface CountrySelectorInputProps
  extends Omit<AutoCompleatInputProps<Country>, "renderElement" | "options"> {
  renderSections: (keyof Country)[];
}

const CountrySelectorInput = (
  { renderSections, setValue = omit, ...props }: CountrySelectorInputProps,
  ref: Ref<HTMLInputElement>
) => {
  const [country, setCountry] = useState<Country>();

  const renderElement = renderAttributes(...renderSections);

  const handleSelect = (value?: Country) => {
    setCountry(value);
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
      selected={renderElement(country)}
    />
  );
};

export default forwardRef(CountrySelectorInput);
