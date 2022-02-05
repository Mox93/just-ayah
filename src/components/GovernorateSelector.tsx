import { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { CountryCode } from "../models/country";
import {
  egPrefix,
  egStrip,
  Governorate,
  governorate,
  governorateList,
} from "../models/governorate";
import DropdownMenu from "./DropdownMenu";
import InputField from "./InputField";

interface GovernorateSelectorProps {
  country?: CountryCode;
  label: string;
  value?: string;
  onChange: (value: string) => void;
  required?: boolean;
}

const GovernorateSelector: FunctionComponent<GovernorateSelectorProps> = ({
  country,
  value,
  ...props
}) => {
  const { t } = useTranslation();
  const g = (value: string) => t(`governorate.egypt.${egStrip(value)}`);

  return country === "EG" ? (
    <DropdownMenu
      {...props}
      selected={value?.startsWith(egPrefix) ? value : ""}
      className="governorate-selector"
      name="governorate"
      options={governorateList}
      getValue={(element) =>
        governorate.includes(egStrip(element) as Governorate)
          ? g(element)
          : undefined
      }
      renderElement={(element) => g(element)}
    />
  ) : (
    <InputField
      {...props}
      value={value?.startsWith(egPrefix) ? "" : value}
      name="governorate"
    />
  );
};

export default GovernorateSelector;
