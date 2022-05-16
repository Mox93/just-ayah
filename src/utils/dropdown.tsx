import {
  ReactElement,
  useCallback,
  useEffect,
  useReducer,
  useRef,
} from "react";

import { cn } from ".";
import { OverflowDir, useOverflowDir } from "./overflow";

import "styles/components/dropdown.scss";

type DropdownState = { isOpen: boolean };
export type DropdownAction = "open" | "close" | "toggle";

const reduce = (
  state: DropdownState,
  action: DropdownAction
): DropdownState => {
  switch (action) {
    case "open":
      return { ...state, isOpen: true };
    case "close":
      return { ...state, isOpen: false };
    case "toggle":
      return { ...state, isOpen: !state.isOpen };
    default:
      return state;
  }
};

export interface DropdownWrapperProps {
  className?: string;
  dir?: string;
  overflowDir?: OverflowDir;
}

export const useDropdown = ({
  className,
  dir,
  overflowDir,
}: DropdownWrapperProps) => {
  const [{ isOpen }, dispatch] = useReducer(reduce, { isOpen: false });

  const driverRef = useRef<any>(null);
  const drivenRef = useRef<any>(null);

  useEffect(() => {
    const handleWentOutside = (event: Event) =>
      event.target instanceof Node &&
      !driverRef?.current?.contains(event.target) &&
      !drivenRef.current?.contains(event.target) &&
      dispatch("close");

    const handelCancelButtons = (event: KeyboardEvent) =>
      ["Escape"].includes(event.key) && dispatch("close");

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

  const oDir = useOverflowDir(overflowDir, dir);

  // TODO fix issue with dropdown keyboard control
  // const handleToggleButtons = useCallback((event: KeyboardEvent) => {
  //   if ([" "].includes(event.key)) {
  //     event.preventDefault();
  //     dispatch("toggle");
  //   } else if (["ArrowDown"].includes(event.key)) {
  //     dispatch("open");
  //   }
  // }, []);

  const wrapper = useCallback(
    (driver: ReactElement, driven: ReactElement) => {
      return (
        <div
          className={cn("DropdownWrapper", className)}
          dir={oDir}
          // onFocus={() =>
          //   document.addEventListener("keyup", handleToggleButtons)
          // }
          // onBlur={() =>
          //   document.removeEventListener("keyup", handleToggleButtons)
          // }
        >
          {driver}
          {isOpen && <div className="buffer">{driven}</div>}
        </div>
      );
    },
    [className, oDir, isOpen] // , handleToggleButtons]
  );

  return {
    driverRef,
    drivenRef,
    isOpen,
    dropdownAction: dispatch,
    dropdownWrapper: wrapper,
  };
};
