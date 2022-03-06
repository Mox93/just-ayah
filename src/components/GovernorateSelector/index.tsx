import { FunctionComponent } from "react";

import DropdownMenu from "components/DropdownMenu";
import InputField from "components/InputField";
import { CountryCode } from "models/country";
import {
  egPrefix,
  egStrip,
  Governorate,
  governorate,
  governorateList,
} from "models/governorate";

import "./style.scss";
import { useGovT } from "utils/translation";

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
  const gov = useGovT("egypt");

  return country === "EG" ? (
    <DropdownMenu
      {...props}
      selected={value?.startsWith(egPrefix) ? value : ""}
      className="GovernorateSelector"
      name="governorate"
      options={governorateList}
      mapValue={(element) =>
        governorate.includes(egStrip(element) as Governorate)
          ? gov(element)
          : undefined
      }
      renderElement={(element) => gov(element)}
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
