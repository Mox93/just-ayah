import {
  ChangeEvent,
  FunctionComponent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

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

  const inputRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  const handleClickOutside = (event: MouseEvent) =>
    event.target instanceof Node &&
    !menuRef.current?.contains(event.target) &&
    !inputRef.current?.contains(event.target) &&
    setIsOpen(false);

  const handelCancelButtons = (event: KeyboardEvent) =>
    ["Escape"].includes(event.key) && setIsOpen(false);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mouseup", handleClickOutside);
      document.addEventListener("keyup", handelCancelButtons);
    } else {
      document.removeEventListener("mouseup", handleClickOutside);
      document.removeEventListener("keyup", handelCancelButtons);
    }

    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
      document.removeEventListener("keyup", handelCancelButtons);
    };
  }, [isOpen]);

  return (
    <div className={`DropdownMenu ${className}`}>
      <div ref={inputRef}>
        <InputField
          name={name}
          label={label}
          value={getValue(selected)}
          onClick={() => setIsOpen((state) => !state)}
          validators={[Boolean]}
          readOnly
          required={required}
        />
      </div>
      {isOpen && (
        <ul ref={menuRef} className="menu">
          {options.map((element) => (
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
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownMenu;
