import cn from "classnames";
import { FunctionComponent, useState } from "react";

import { identity, omit } from "utils";

interface RadioSelectorProps {
  name: string;
  label: string;
  options: { value: string; name: string }[];
  selected?: string;
  onChange?: (value: any) => void;
  map?: (value: string) => any;
  required?: boolean;
}

type selectionState = "pending" | "set" | "abandoned";

const RadioSelector: FunctionComponent<RadioSelectorProps> = ({
  name,
  label,
  options,
  selected,
  map = identity,
  onChange = omit,
  required = false,
}) => {
  const [state, setState] = useState<selectionState>("pending");
  const invalid = state === "abandoned" && required;

  return (
    <div className="RadioSelector">
      <h3 className={`title ${cn({ required, invalid })}`}>{label}</h3>
      <div className="field">
        {options.map((option) => (
          <>
            <input
              type="radio"
              name={name}
              id={`${name}_${option.value}`}
              checked={selected === option.value}
              onChange={() => {
                setState("set");
                onChange(map(option.value));
              }}
              onBlur={() => {
                if (state === "pending") setState("abandoned");
              }}
            />
            <label
              className={cn({ invalid }, "option")}
              htmlFor={`${name}_${option.value}`}
            >
              {option.name}
            </label>
          </>
        ))}
      </div>
    </div>
  );
};

export default RadioSelector;
