import { Ref, useLayoutEffect, useRef, useState } from "react";

import { useUpdate } from "hooks";
import { mergeRefs } from "utils";

type AnchorPoint =
  | "top"
  | "bottom"
  | "start"
  | "end"
  | `${"top" | "bottom"}-${"start" | "end"}`;

export type UseFaderProps = {
  isOpen?: boolean;
  duration?: number;
  expand?: boolean;
  onFadeIn?: VoidFunction;
  afterFadeIn?: VoidFunction;
  onFadeOut?: VoidFunction;
  afterFadeOut?: VoidFunction;
} & (
  | {
      move: true;
      anchorPoint: AnchorPoint;
    }
  | {
      move?: false;
      anchorPoint?: AnchorPoint;
    }
);

export function useFader<T extends HTMLElement>({
  isOpen,
  duration = 150,
  anchorPoint,
  expand,
  move,
  onFadeIn,
  afterFadeIn,
  onFadeOut,
  afterFadeOut,
  ref,
}: UseFaderProps & { ref?: Ref<T> }) {
  const [isVisible, setIsVisible] = useState(isOpen);

  const internalRef = useRef<T>(null);
  const wasOpenRef = useRef(isOpen);

  useUpdate(() => {
    if (isOpen === wasOpenRef.current) return;

    let timeouts: NodeJS.Timeout[] = [];

    if (isOpen) {
      onFadeIn?.();
      timeouts.push(
        setTimeout(
          () => internalRef.current?.classList.add("visibleContent"),
          duration * 0.5
        ),
        setTimeout(() => afterFadeIn?.(), duration)
      );
      setIsVisible(true);
    } else {
      onFadeOut?.();
      timeouts.push(
        setTimeout(() => {
          setIsVisible(false);
          afterFadeOut?.();
        }, duration)
      );
      internalRef.current?.classList.remove("visibleContent");
    }

    wasOpenRef.current = isOpen;

    return () => timeouts.forEach((timeout) => clearTimeout(timeout));
  }, [isOpen, duration]);

  useLayoutEffect(() => {
    if (!internalRef.current) return;

    internalRef.current.style.setProperty("--fade-duration", `${duration}ms`);

    internalRef.current.classList.add(
      "Fader",
      ...(anchorPoint ? anchorPoint.split("-").map((cls) => `ap-${cls}`) : [])
    );

    const classNames: Partial<Record<string, boolean>> = {
      expandable: expand,
      movable: move,
      fadeIn: isOpen,
      fadeOut: !isOpen && isVisible,
    };

    internalRef.current.classList.add(
      ...Object.keys(classNames).filter((key) => classNames[key])
    );

    internalRef.current.classList.remove(
      ...Object.keys(classNames).filter((key) => !classNames[key])
    );
  }, [anchorPoint, duration, expand, isOpen, isVisible, move, ref]);

  return [mergeRefs(ref, internalRef), isVisible] as const;
}
