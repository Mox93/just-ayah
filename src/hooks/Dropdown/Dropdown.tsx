import {
  ReactElement,
  useCallback,
  useEffect,
  useReducer,
  useRef,
} from "react";

import { cn } from "utils";

import { useDirT } from "../Translation";

export type OverflowDir = "start" | "end";

const useOverflowDir = (direction?: OverflowDir, fallback?: string) => {
  const dirT = useDirT();

  if (dirT === "rtl" && direction === "start") return "ltr";
  if (dirT === "rtl" && direction === "end") return "rtl";
  if (dirT === "ltr" && direction === "start") return "rtl";
  if (dirT === "ltr" && direction === "end") return "ltr";
  return fallback;
};

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

interface UseDropdownProps {
  className?: string;
  dir?: string;
  overflowDir?: OverflowDir;
  onClick?: "open" | "toggle";
}

const useDropdown = ({
  className,
  dir,
  overflowDir,
  onClick,
}: UseDropdownProps = {}) => {
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

  useEffect(() => {
    if (!onClick) return;

    const driver = driverRef.current;

    if (driver) driver.onclick = () => dispatch(onClick);
  }, [onClick]);

  const oDir = useOverflowDir(overflowDir, dir);

  // FIXME issue with dropdown keyboard control
  // const handleToggleButtons = useCallback((event: KeyboardEvent) => {
  //   if ([" "].includes(event.key)) {
  //     event.preventDefault();
  //     dispatch("toggle");
  //   } else if (["ArrowDown"].includes(event.key)) {
  //     dispatch("open");
  //   }
  // }, []);

  const wrapper = useCallback(
    (driver: ReactElement, driven: () => ReactElement) => {
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
          {isOpen && <div className="buffer">{driven()}</div>}
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

export default useDropdown;
