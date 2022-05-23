import { forwardRef, Ref, useEffect } from "react";

import { useGovT } from "hooks";
import { CountryCode } from "models/country";
import { egStrip, egGovernorate, EG_PREFIX } from "models/governorate";
import { omit } from "utils";

import MenuInput, { MenuInputProps } from "../MenuInput";
import Input from "../Input";

interface GovernorateSelectorInputProps extends MenuInputProps<string> {
  country?: CountryCode;
  selected?: string;
}

const GovernorateSelectorInput = (
  {
    country,
    selected,
    setValue = omit,
    ...props
  }: GovernorateSelectorInputProps,
  ref: Ref<HTMLInputElement>
) => {
  const gov = useGovT("egypt");

  useEffect(() => {
    if (
      (country === "EG" && !selected?.startsWith(EG_PREFIX)) ||
      (country !== "EG" && selected?.startsWith(EG_PREFIX))
    )
      setValue();
  }, [country, selected]);

  return country === "EG" ? (
    <MenuInput
      {...props}
      ref={ref}
      options={egGovernorate}
      renderElement={[egStrip, gov]}
      setValue={setValue}
      selected={selected}
    />
  ) : (
    <Input {...props} ref={ref} />
  );
};

export default forwardRef(GovernorateSelectorInput);
