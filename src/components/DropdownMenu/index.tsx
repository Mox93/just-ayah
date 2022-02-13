import { FunctionComponent, ReactNode, useState } from "react";

import { identity } from "utils";
import InputField from "components/InputField";

import "./style.scss";

interface DropdownMenuProps {
  label: string;
  name?: string;
  options: any[];
  selected?: any;
  className?: string;
  map?: (value: any) => any;
  getValue?: (selected: any) => string | undefined;
  getKey?: (option: any) => string;
  renderElement?: (option: any) => ReactNode;
  onChange: (value: any) => void;
  required?: boolean;
}

const DropdownMenu: FunctionComponent<DropdownMenuProps> = ({
  label,
  name,
  options,
  selected,
  className,
  getValue = identity,
  getKey = identity,
  map = identity,
  renderElement = identity,
  onChange,
  required,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`DropdownMenu ${className}`}>
      <InputField
        name={name}
        label={label}
        value={getValue(selected)}
        onClick={() => {
          setIsOpen((state) => !state);
        }}
        validators={[Boolean]}
        readOnly
        required={required}
      />
      {isOpen && (
        <ul className="menu">
          {options.map((element) => {
            return (
              <li
                className="element"
                key={getKey(element)}
                onClick={() => {
                  onChange(map(element));
                  setIsOpen(false);
                }}
              >
                {renderElement(element)}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default DropdownMenu;
