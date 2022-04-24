import { forwardRef, ReactNode, Ref, useEffect, useRef, useState } from "react";

import { ReactComponent as Angle } from "assets/icons/angle-up-svgrepo-com.svg";
import { Merge } from "models";
import { cn, identity, omit } from "utils";
import { after, before } from "utils/position";
import { useDirT } from "utils/translation";

import Input, { InputProps } from "../Input";

const OVERFLOW_DIR = { left: "rtl", right: "ltr" };

export type AutoCompleatInputProps<TOption> = Merge<
  InputProps,
  {
    options: TOption[];
    overflowDir?: "right" | "left";
    selected?: ReactNode;
    getKey?: (option: TOption) => string | number;
    setValue?: (option?: TOption) => void;
    renderElement?: (option: TOption) => ReactNode;
  }
>;

/**
 * TODO:
 *  - Implement filtering
 *  - Handle unselect
 */

const AutoCompleatInput = <TOption,>(
  {
    className,
    options,
    dir,
    overflowDir,
    selected,
    getKey = identity,
    setValue = omit,
    renderElement = identity,
    ...props
  }: AutoCompleatInputProps<TOption>,
  ref: Ref<HTMLInputElement>
) => {
  const dirT = useDirT();

  const [isOpen, setIsOpen] = useState(false);

  const inputRef = useRef<HTMLLabelElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) =>
      event.target instanceof Node &&
      !menuRef.current?.contains(event.target) &&
      !inputRef?.current?.contains(event.target) &&
      setIsOpen(false);

    const handelCancelButtons = (event: KeyboardEvent) =>
      ["Escape"].includes(event.key) && setIsOpen(false);

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
    <div
      className={cn("AutoCompleatInput", className)}
      dir={overflowDir ? OVERFLOW_DIR[overflowDir] : dir}
    >
      <Input
        {...props}
        dir={dir || dirT}
        readOnly // TODO remove when filtering is implemented
        ref={ref}
        labelRef={inputRef}
        hidden={!isOpen && !!selected}
        onClick={() => !isOpen && setIsOpen(true)}
      >
        {!isOpen && selected
          ? before("input", <div className="selected">{selected}</div>)
          : null}
        {after("input", <Angle className={cn({ isOpen }, "arrow")} />)}
      </Input>

      {isOpen && (
        <ul ref={menuRef} className="menu" dir={dir || dirT}>
          {options.map((option) => (
            <li
              className="element"
              key={getKey(option)}
              onClick={() => {
                setValue(option);
                setIsOpen(false);
              }}
            >
              {renderElement(option)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default forwardRef(AutoCompleatInput);
