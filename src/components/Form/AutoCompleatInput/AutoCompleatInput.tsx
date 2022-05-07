import {
  forwardRef,
  ReactNode,
  Ref,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { ReactComponent as Angle } from "assets/icons/angle-up-svgrepo-com.svg";
import { Merge } from "models";
import { cn, identity, omit } from "utils";
import { after, before } from "utils/position";
import { useDirT } from "utils/translation";

import Input, { InputProps } from "../Input";
import { OverflowDir, useOverflowDir } from "utils/overflow";

export type AutoCompleatInputProps<TOption> = Merge<
  InputProps,
  {
    overflowDir?: OverflowDir;
    setValue?: (option?: TOption) => void;
  }
>;

interface InternalAutoCompleatInputProps<TOption>
  extends AutoCompleatInputProps<TOption> {
  options: TOption[];
  selected?: ReactNode;
  renderElement?: (option: TOption) => ReactNode;
  getKey?: (option: TOption) => string | number;
}

/**
 * TODO:
 *  - Implement filtering
 *  - Handle reset selection
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
  }: InternalAutoCompleatInputProps<TOption>,
  ref: Ref<HTMLInputElement>
) => {
  const dirT = useDirT();

  const [isOpen, setIsOpen] = useState(false);

  const inputRef = useRef<HTMLLabelElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  const handleToggleButtons = useCallback(
    (event: KeyboardEvent) =>
      [" "].includes(event.key)
        ? setIsOpen((state) => !state)
        : ["ArrowDown"].includes(event.key)
        ? setIsOpen(true)
        : undefined,
    []
  );

  useEffect(() => {
    const handleWentOutside = (event: Event) =>
      event.target instanceof Node &&
      !menuRef.current?.contains(event.target) &&
      !inputRef?.current?.contains(event.target) &&
      setIsOpen(false);

    const handelCancelButtons = (event: KeyboardEvent) =>
      ["Escape"].includes(event.key) && setIsOpen(false);

    const events = {
      mouseup: handleWentOutside,
      focusin: handleWentOutside,
      keyup: handelCancelButtons,
    };

    const addEvents = () => {
      Object.entries(events).forEach(([type, callback]) =>
        document.addEventListener(
          type as keyof DocumentEventMap,
          callback as EventListenerOrEventListenerObject
        )
      );
    };

    const RemoveEvents = () => {
      Object.entries(events).forEach(([type, callback]) =>
        document.removeEventListener(
          type as keyof DocumentEventMap,
          callback as EventListenerOrEventListenerObject
        )
      );
    };

    isOpen ? addEvents() : RemoveEvents();

    return RemoveEvents;
  }, [isOpen]);

  // TODO add a second input field for searching and use autoFocus

  return (
    <div
      className={cn("AutoCompleatInput", className)}
      dir={useOverflowDir(overflowDir) || dir}
      onFocus={() => document.addEventListener("keyup", handleToggleButtons)}
      onBlur={() => document.removeEventListener("keyup", handleToggleButtons)}
    >
      <Input
        {...props}
        className={cn({ hidden: selected })} // TODO once filtering is implemented replace condition with `!isOpen && selected`
        dir={dir || dirT}
        readOnly // TODO remove once filtering is implemented
        ref={ref}
        labelRef={inputRef}
        onClick={() => setIsOpen(true)}
      >
        {selected // TODO once filtering is implemented replace condition with `!isOpen && selected`
          ? before("input", <div className="selected">{selected}</div>)
          : null}
        {after("input", <Angle className={cn({ isOpen }, "arrow")} />)}
      </Input>

      {isOpen && (
        <ul ref={menuRef} className="menu" dir={dir || dirT}>
          {options.map((option) => (
            // TODO convert to radio input
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
