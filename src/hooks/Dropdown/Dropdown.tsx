import { ReactElement, useCallback, useEffect, useRef, useState } from "react";

import { useFader } from "components/Animation";
import { cn, eventFactory, oneOf } from "utils";
import useEventListener from "hooks/EventListener";

export type AnchorPoint = `${"top" | "bottom"}-${"start" | "end"}`;

export interface UseDropdownProps {
  className?: string;
  dir?: string;
  anchorPoint?: AnchorPoint;
  sideMounted?: boolean;
  onClick?: "open" | "toggle";
}

export default function useDropdown<
  T1 extends HTMLElement,
  T2 extends HTMLElement
>({
  className,
  dir,
  anchorPoint = "top-start",
  sideMounted,
  onClick,
}: UseDropdownProps = {}) {
  const [isOpen, setIsOpen] = useState(false);

  const driverRef = useRef<T1>(null);
  const internalDrivenRef = useRef<T2>(null);

  const open = useRef(() => setIsOpen(true));
  const close = useRef(() => setIsOpen(false));
  const toggle = useRef(() => setIsOpen((state) => !state));

  const handleWentOutside = useRef((event: Event) => {
    if (!driverRef.current || !internalDrivenRef.current) return;

    if (
      event.target instanceof Node &&
      !driverRef.current?.contains(event.target) &&
      !internalDrivenRef.current?.contains(event.target)
    )
      close.current();
  });

  const handelCancelButtons = useRef((event: KeyboardEvent) => {
    if (oneOf(event.key, ["Escape"])) close.current();
  });

  useEffect(() => {
    const [addEventListeners, removeEventListeners] = eventFactory(document, {
      mouseup: handleWentOutside.current,
      focusin: handleWentOutside.current,
      keyup: handelCancelButtons.current,
    });

    if (isOpen) {
      addEventListeners();
    } else {
      removeEventListeners();
    }

    return removeEventListeners;
  }, [isOpen]);

  useEventListener(
    driverRef.current,
    driverRef.current && onClick
      ? {
          click: onClick === "open" ? open.current : toggle.current,
        }
      : {}
  );

  // FIXME issue with dropdown keyboard control
  // const handleToggleButtons = useCallback((event: KeyboardEvent) => {
  //   if ([" "].includes(event.key)) {
  //     event.preventDefault();
  //     dispatch("toggle");
  //   } else if (["ArrowDown"].includes(event.key)) {
  //     dispatch("open");
  //   }
  // }, []);

  const [drivenRef, isVisible] = useFader({
    isOpen,
    anchorPoint: (sideMounted ? anchorPoint : anchorPoint.split("-")[0]) as any,
    expand: true,
    ref: internalDrivenRef,
  });

  const wrapper = useCallback(
    (driver: ReactElement, driven: ReactElement) => (
      <div className={cn("DropdownWrapper", className)} dir={dir}>
        {driver}
        {isVisible && (
          <div
            className={cn(
              "buffer",
              ...anchorPoint.split("-").map((x) => `ap-${x}`),
              { sideMounted }
            )}
          >
            {driven}
          </div>
        )}
      </div>
    ),
    [anchorPoint, className, dir, isVisible, sideMounted]
  );

  return {
    driverRef,
    drivenRef,
    isOpen,
    open: open.current,
    close: close.current,
    toggle: toggle.current,
    dropdownWrapper: wrapper,
  };
}
