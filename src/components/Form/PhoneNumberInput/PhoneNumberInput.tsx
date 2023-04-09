import { HTMLAttributes, ReactNode, Ref } from "react";

import { ReactComponent as CallIcon } from "assets/icons/call-svgrepo-com.svg";
import { ReactComponent as WhatsAppIcon } from "assets/icons/whatsapp-svgrepo-com.svg";
import { ReactComponent as TelegramIcon } from "assets/icons/telegram-svgrepo-com.svg";
import { useGlobalT, useMessageT } from "hooks";
import {
  Country,
  CountryCode,
  countrySelectorProps,
  phoneNumberTagsSchema,
  PhoneNumberTag,
} from "models/blocks";
import { cn } from "utils";
import { after, PositionalElement } from "utils/position";

import FieldHeader from "../FieldHeader";
import FieldWrapper from "../FieldWrapper";
import Input, { InputProps } from "../Input";
import MenuInput, { MenuInputProps } from "../MenuInput";
import SelectionInput, { SelectionInputProps } from "../SelectionInput";

type InnerProps<TProps, TElement = any> = Partial<TProps> & {
  ref?: Ref<TElement>;
};

interface PhoneNumberInputProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
  name?: string;
  isInvalid?: boolean;
  isRequired?: boolean;
  children?: PositionalElement<string>;
  errorMessage?: ReactNode;
  withTags?: boolean;
  innerProps?: {
    code?: InnerProps<MenuInputProps<Country> & { selected?: CountryCode }>;
    number?: InnerProps<InputProps>;
    tags?: InnerProps<SelectionInputProps<PhoneNumberTag>>;
  };
}

export default function PhoneNumberInput({
  label,
  isRequired,
  isInvalid,
  name,
  children,
  errorMessage,
  className,
  withTags,
  innerProps: { code: codeProps, number: numberProps, tags: tagsProps } = {},
  ...props
}: PhoneNumberInputProps) {
  const glb = useGlobalT();
  const msg = useMessageT();

  return (
    <div {...props} className={cn("PhoneNumberInput", className)}>
      <FieldHeader {...{ label, isRequired, isInvalid }}>
        {children}
      </FieldHeader>

      <FieldWrapper
        dir="ltr"
        isInvalid={isInvalid}
        addPartitions
        contentFullWidth
      >
        <MenuInput
          name={`${name}.code`}
          dir="ltr"
          placeholder="+00"
          {...codeProps}
          className={cn("countryCode", codeProps?.className)}
          searchFields={["code", "phone", "name", "native"]}
          {...countrySelectorProps(
            ["emoji", "code", "phone"],
            codeProps?.selected
          )}
        />

        <Input
          name={`${name}.number`}
          dir="ltr"
          placeholder="000-000-0000"
          {...numberProps}
          className={cn("dialNumber", numberProps?.className)}
        />
      </FieldWrapper>

      {withTags && (
        <SelectionInput
          type="checkbox"
          options={phoneNumberTagsSchema.options}
          name={`${name}.tags`}
          isInvalid={isInvalid}
          renderElement={(option) => (
            <>
              {ICONS[option]}
              {glb(option)}
            </>
          )}
          {...tagsProps}
          className={cn("contactOptions", tagsProps?.className)}
        >
          {after("field", <span>{`* ${msg("selectAvailable")}`}</span>)}
        </SelectionInput>
      )}
      {errorMessage}
    </div>
  );
}

const ICONS = {
  call: <CallIcon className="call" />,
  whatsapp: <WhatsAppIcon className="whatsapp" />,
  telegram: <TelegramIcon className="telegram" />,
};
