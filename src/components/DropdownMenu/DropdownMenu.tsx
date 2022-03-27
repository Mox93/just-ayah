import {
  FunctionComponent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

import { cn, identity, omit } from "utils";
import InputField, { InputFieldProps } from "components/InputField";

interface DropdownMenuProps extends Omit<InputFieldProps, "value" | "map"> {
  options: any[];
  selected?: any;
  mapSelection?: (value: any) => any;
  mapValue?: (selected: any) => string | undefined;
  mapKey?: (option: any) => string;
  renderElement?: (option: any) => ReactNode;
}

const DropdownMenu: FunctionComponent<DropdownMenuProps> = ({
  options,
  selected,
  className,
  mapValue = identity,
  mapKey = identity,
  mapSelection = identity,
  renderElement = identity,
  onChange = omit,
  ...props
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
    <div className={cn("DropdownMenu", className)}>
      <div ref={inputRef}>
        <InputField
          {...props}
          value={mapValue(selected)}
          onClick={() => setIsOpen((state) => !state)}
          validators={[Boolean]}
          readOnly
        />
      </div>
      {isOpen && (
        <ul ref={menuRef} className="menu">
          {options.map((element) => (
            <li
              className="element"
              key={mapKey(element)}
              onClick={() => {
                onChange(mapSelection(element), true);
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
