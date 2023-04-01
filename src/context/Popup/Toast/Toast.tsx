import { ReactElement } from "react";

import { ReactComponent as DangerIcon } from "assets/icons/block-svgrepo-com.svg";
import { ReactComponent as InfoIcon } from "assets/icons/info-svgrepo-com.svg";
import { ReactComponent as SuccessIcon } from "assets/icons/success-svgrepo-com.svg";
import { ReactComponent as WarningIcon } from "assets/icons/warning-svgrepo-com.svg";
import { CloseButton } from "components/Buttons";
import { cn } from "utils";

export type ToastVariant = "success" | "info" | "warning" | "danger";

const icons: Record<ToastVariant, ReactElement> = {
  success: <SuccessIcon className="toastIcon iconL" />,
  info: <InfoIcon className="toastIcon iconL" />,
  warning: <WarningIcon className="toastIcon iconL" />,
  danger: <DangerIcon className="toastIcon iconL" />,
};

export interface ToastProps {
  message: string | ReactElement;
  variant?: ToastVariant;
  floating?: boolean;
  dir?: string;
  close?: VoidFunction;
}

export default function Toast({
  message,
  floating,
  variant = "info",
  dir,
  close,
}: ToastProps) {
  return (
    <div className={cn("Toast", variant, { floating })} dir={dir}>
      {icons[variant]}
      <p className="message">{message}</p>
      <CloseButton onClick={close} />
    </div>
  );
}
