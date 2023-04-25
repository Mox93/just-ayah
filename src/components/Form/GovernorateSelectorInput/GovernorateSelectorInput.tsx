import { forwardRef, useEffect } from "react";

import { useGovT } from "hooks";
import { CountryCode, egGovernorate, egStrip, EG_PREFIX } from "models/blocks";

import Input from "../Input";
import MenuInput, { MenuInputProps } from "../MenuInput";

interface GovernorateSelectorInputProps extends MenuInputProps<string> {
  country?: CountryCode;
  selected?: string;
}

export default forwardRef<HTMLInputElement, GovernorateSelectorInputProps>(
  function GovernorateSelectorInput(
    { country, selected, setValue, ...props },
    ref
  ) {
    const gov = useGovT("egypt");

    useEffect(() => {
      if (
        (country === "EG" && !selected?.startsWith(EG_PREFIX)) ||
        (country !== "EG" && selected?.startsWith(EG_PREFIX))
      )
        setValue?.();
    }, [country, selected]); // Don't add setValue because it causes a infinite loop

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
  }
);
