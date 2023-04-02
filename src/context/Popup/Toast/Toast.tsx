import { ReactElement, useCallback, useEffect, useRef } from "react";

import { ReactComponent as DangerIcon } from "assets/icons/block-svgrepo-com.svg";
import { ReactComponent as InfoIcon } from "assets/icons/info-svgrepo-com.svg";
import { ReactComponent as SuccessIcon } from "assets/icons/success-svgrepo-com.svg";
import { ReactComponent as WarningIcon } from "assets/icons/warning-svgrepo-com.svg";
import { CloseButton } from "components/Buttons";
import { cn, mergeCallbacks } from "utils";

export type ToastVariant = "success" | "info" | "warning" | "danger";

const icons: Record<ToastVariant, ReactElement> = {
  success: <SuccessIcon className="toastIcon iconL" />,
  info: <InfoIcon className="toastIcon iconL" />,
  warning: <WarningIcon className="toastIcon iconL" />,
  danger: <DangerIcon className="toastIcon iconL" />,
};

export interface ToastProps {
  message: string | ReactElement;
  duration?: number;
  variant?: ToastVariant;
  floating?: boolean;
  dir?: string;
  close?: VoidFunction;
}

export default function Toast({
  message,
  duration = 7e3,
  floating,
  variant = "info",
  dir,
  close,
}: ToastProps) {
  console.log(`Toast ${variant} rendered`);

  const timeoutRef = useRef<NodeJS.Timeout>();
  const startAtRef = useRef(new Date());
  const progressRef = useRef(0);
  const ref = useRef<HTMLDivElement>(null);

  const startCountdown = useCallback(
    (remainingDuration?: number) => {
      const _duration = Math.max(
        (remainingDuration ?? duration) -
          (new Date().getTime() - startAtRef.current.getTime()),
        0
      );

      ref.current?.style.setProperty("--toast-lifetime", `${_duration}ms`);

      timeoutRef.current = setTimeout(() => close?.(), _duration);
    },
    [close, duration]
  );

  const stopCountdown = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  };

  useEffect(() => {
    startCountdown();

    return stopCountdown;
  }, [startCountdown]);

  return (
    <div
      className={cn("Toast", variant, { floating })}
      dir={dir}
      ref={ref}
      onPointerEnter={() => {
        stopCountdown();

        const passedTime = new Date().getTime() - startAtRef.current.getTime();

        progressRef.current += passedTime;

        ref.current?.style.setProperty("--toast-lifetime", `0ms`);
        ref.current?.style.setProperty(
          "--toast-countdown",
          `${Math.max(1 - progressRef.current / duration, 0) * 100}%`
        );
      }}
      onPointerLeave={() => {
        startAtRef.current = new Date();
        startCountdown(duration - progressRef.current);
      }}
    >
      {icons[variant]}
      <p className="message">{message}</p>
      <CloseButton onClick={mergeCallbacks(close, stopCountdown)} />
    </div>
  );
}
