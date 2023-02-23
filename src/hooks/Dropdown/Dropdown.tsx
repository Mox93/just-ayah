import { ReactElement, useCallback, useEffect, useRef, useState } from "react";

import { cn, oneOf } from "utils";

import { useDirT } from "../Translation";

export type OverflowDir = "start" | "end";

const getOverflowDir = (dir: string, overflow?: OverflowDir) => {
  if (dir === "rtl" && overflow === "start") return "ltr";
  if (dir === "rtl" && overflow === "end") return "rtl";
  if (dir === "ltr" && overflow === "start") return "rtl";
  if (dir === "ltr" && overflow === "end") return "ltr";
  return dir;
};

interface UseDropdownProps {
  className?: string;
  dir?: string;
  overflowDir?: OverflowDir;
  onClick?: "open" | "toggle";
}

export default function useDropdown({
  className,
  dir,
  overflowDir,
  onClick,
}: UseDropdownProps = {}) {
  const [isOpen, setIsOpen] = useState(false);

  const driverRef = useRef<any>(null);
  const drivenRef = useRef<any>(null);
  const dirT = useDirT();

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((state) => !state), []);

  useEffect(() => {
    const handleWentOutside = (event: Event) =>
      event.target instanceof Node &&
      !driverRef?.current?.contains(event.target) &&
      !drivenRef.current?.contains(event.target) &&
      close();

    const handelCancelButtons = (event: KeyboardEvent) =>
      oneOf(event.key, ["Escape"]) && close();

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

    if (isOpen) {
      addEvents();
    } else {
      RemoveEvents();
    }

    return RemoveEvents;
  }, [isOpen]);

  useEffect(() => {
    const driver = driverRef.current;

    if (driver)
      driver.onclick =
        onClick === "open" ? open : onClick === "toggle" ? toggle : undefined;
  }, [onClick]);

  const oDir = getOverflowDir(dir || dirT, overflowDir);

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
        <div className={cn("DropdownWrapper", className)} dir={oDir}>
          {driver}
          {isOpen && <div className="buffer">{driven()}</div>}
        </div>
      );
    },
    [className, oDir, isOpen]
  );

  return {
    driverRef,
    drivenRef,
    isOpen,
    open,
    close,
    toggle,
    dropdownWrapper: wrapper,
  };
}
