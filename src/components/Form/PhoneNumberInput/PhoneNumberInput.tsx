import { FC, HTMLAttributes, ReactNode } from "react";

import { ReactComponent as CallIcon } from "assets/icons/call-svgrepo-com.svg";
import { ReactComponent as WhatsAppIcon } from "assets/icons/whatsapp-svgrepo-com.svg";
import { ReactComponent as TelegramIcon } from "assets/icons/telegram-svgrepo-com.svg";
import { InnerProps } from "models";
import { phoneNumberTags, PhoneNumberTags } from "models/phoneNumber";
import { cn } from "utils";
import { PositionalElement } from "utils/position";
import { useGlobalT } from "utils/translation";

import CountrySelectorInput, {
  CountrySelectorInputProps,
} from "../CountrySelectorInput";
import FieldHeader from "../FieldHeader";
import FieldWrapper from "../FieldWrapper";
import Input, { InputProps } from "../Input";
import SelectionInput, { SelectionInputProps } from "../SelectionInput";

interface PhoneNumberInputProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
  name?: string;
  isInvalid?: boolean;
  isRequired?: boolean;
  children?: PositionalElement<string>;
  errorMessage?: ReactNode;
  withTags?: boolean;
  innerProps?: {
    code?: InnerProps<CountrySelectorInputProps>;
    number?: InnerProps<InputProps>;
    tags?: InnerProps<SelectionInputProps<PhoneNumberTags>>;
  };
}

const PhoneNumberInput: FC<PhoneNumberInputProps> = ({
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
}) => {
  const glb = useGlobalT();

  // TODO add tags
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
        <CountrySelectorInput
          name={`${name}.code`}
          renderSections={["emoji", "code", "phone"]}
          dir="ltr"
          placeholder="+00"
          {...codeProps}
          className={cn("countryCode", codeProps?.className)}
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
          options={[...phoneNumberTags]}
          name={`${name}.tags`}
          isInvalid={isInvalid}
          renderElement={(option) => (
            <>
              {icons[option]}
              {glb(option)}
            </>
          )}
          {...tagsProps}
        />
      )}
      {errorMessage}
    </div>
  );
};

export default PhoneNumberInput;

const icons: { [key in PhoneNumberTags]: ReactNode } = {
  call: <CallIcon className="call" />,
  whatsapp: <WhatsAppIcon className="whatsapp" />,
  telegram: <TelegramIcon className="telegram" />,
};
