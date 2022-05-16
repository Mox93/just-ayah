import { forwardRef, Ref, useEffect, useState } from "react";

import { CountryCode } from "models/country";
import { egStrip, egGovernorate, EG_PREFIX } from "models/governorate";
import { omit } from "utils";
import { useGovT } from "utils/translation";

import AutoCompleatInput, {
  AutoCompleatInputProps,
} from "../AutoCompleatInput";
import Input from "../Input";

interface GovernorateSelectorInputProps extends AutoCompleatInputProps<string> {
  country?: CountryCode;
}

const GovernorateSelectorInput = (
  { country, setValue = omit, ...props }: GovernorateSelectorInputProps,
  ref: Ref<HTMLInputElement>
) => {
  const gov = useGovT("egypt");

  const [selected, setSelected] = useState<string>();

  const handleSelect = (value?: string) => {
    setSelected(value);
    setValue(value);
  };

  useEffect(() => {
    if (
      (country === "EG" && !selected?.startsWith(EG_PREFIX)) ||
      (country !== "EG" && selected?.startsWith(EG_PREFIX))
    ) {
      setSelected(undefined);
      setValue(undefined);
    }
  }, [country]);

  return country === "EG" ? (
    <AutoCompleatInput
      {...props}
      ref={ref}
      options={egGovernorate}
      renderElement={[egStrip, gov]}
      setValue={handleSelect}
      selected={selected && gov(egStrip(selected))}
    />
  ) : (
    <Input {...props} ref={ref} />
  );
};

export default forwardRef(GovernorateSelectorInput);
