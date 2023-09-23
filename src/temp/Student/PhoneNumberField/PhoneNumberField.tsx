import parsePhoneNumber, { isValidPhoneNumber } from "libphonenumber-js";
import { get } from "lodash";
import { useMemo } from "react";
import { useWatch } from "react-hook-form";

import { ReactComponent as CallIcon } from "assets/icons/call-svgrepo-com.svg";
import { ReactComponent as WhatsAppIcon } from "assets/icons/whatsapp-svgrepo-com.svg";
import { ReactComponent as TelegramIcon } from "assets/icons/telegram-svgrepo-com.svg";
import {
  formAtoms,
  SelectionInput as BaseSelectionInput,
} from "components/Form";
import ErrorMessage from "components/Form/ErrorMessage";
import FieldHeader from "components/Form/FieldHeader";
import { useGlobalT, useMessageT } from "hooks";
import {
  CountryCode,
  PhoneNumberList,
  getCountry,
  phoneNumberTagsSchema,
} from "models/blocks";
import { cn } from "utils";
import { after, before } from "utils/position";
import { transformer } from "utils/transformer";

const FIELDS = {
  CODE: "code",
  NUMBER: "number",
  TAGS: "tags",
} as const;

interface HasPhoneNumber {
  phoneNumber: PhoneNumberList;
}

const {
  Input,
  modifiers: { defaultModifiers },
  useFormContext,
} = formAtoms<HasPhoneNumber>();

const SelectionInput = transformer(BaseSelectionInput, ...defaultModifiers);

interface PhoneNumberFieldProps {
  className?: string;
  name: `phoneNumber.${number}`;
  label: string;
  required?: boolean;
}

export default function PhoneNumberField({
  className,
  label,
  required,
  ...props
}: PhoneNumberFieldProps) {
  const { name } = props;

  const { CODE, NUMBER, TAGS } = useMemo(
    () =>
      Object.entries(FIELDS).reduce((obj, [key, subName]) => {
        obj[key as keyof typeof FIELDS] = `${name}.${subName}` as typeof name;
        return obj;
      }, {} as Record<keyof typeof FIELDS, typeof name>),
    [name]
  );

  const glb = useGlobalT();
  const msg = useMessageT();

  const {
    formHook: {
      control,
      setError,
      clearErrors,
      setValue,
      formState: { errors, isSubmitted },
    },
  } = useFormContext();

  const code = useWatch({ control, name: `${name}.code` });
  const flag = useMemo(() => getCountry(code as CountryCode)?.emoji, [code]);

  const fieldWithError = [CODE, NUMBER, TAGS].find((field) =>
    get(errors, field)
  );

  const isInvalid = !!fieldWithError;

  return (
    <div className={cn("PhoneNumberField", "withErrors", className)} {...props}>
      <FieldHeader label={label} isRequired={required} isInvalid={isInvalid} />

      <Input
        name={`${name}.number`}
        placeholder="+00 000 000 0000"
        dir="ltr"
        type="tel"
        onChange={(e) => {
          const phoneNumber = parsePhoneNumber(e.target.value);

          setValue(`${name}.code`, phoneNumber?.country as CountryCode, {
            shouldValidate: isSubmitted,
          });

          if (isSubmitted && e.target.value && !phoneNumber?.country)
            setError(`${name}.code`, { message: "noCountryCode" });
          else clearErrors(`${name}.code`);
        }}
        isInvalid={isInvalid}
        rules={{
          setValueAs: (v: string) => v && parsePhoneNumber(v)?.number,
          required: required && "noPhoneNumber",
          ...(required && {
            validate: {
              validPhoneNumber: (v?: any) =>
                isValidPhoneNumber(v) || "wrongPhoneNumber",
            },
          }),
        }}
        noErrorMessage
      >
        {before(
          "input",
          <p className={cn("country", { withFlag: flag })}>{flag}</p>
        )}
      </Input>

      <SelectionInput
        className="contactOptions"
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
        rules={
          required
            ? {
                validate: {
                  contactMethod: (v?: any) =>
                    (!!v && (v.length || 0) > 0) || "noContactMethod",
                },
              }
            : undefined
        }
        noErrorMessage
      >
        {after("field", <span>{`* ${msg("selectAvailable")}`}</span>)}
      </SelectionInput>

      <ErrorMessage name={fieldWithError as any} errors={errors} />
    </div>
  );
}

const ICONS = {
  call: <CallIcon className="call" />,
  whatsapp: <WhatsAppIcon className="whatsapp" />,
  telegram: <TelegramIcon className="telegram" />,
};
