import { FC, ReactElement, SVGProps } from "react";

import { ReactComponent as DangerIcon } from "assets/icons/block-svgrepo-com.svg";
import { ReactComponent as InfoIcon } from "assets/icons/info-svgrepo-com.svg";
import { ReactComponent as SuccessIcon } from "assets/icons/success-svgrepo-com.svg";
import { ReactComponent as WarningIcon } from "assets/icons/warning-svgrepo-com.svg";
import { CloseButton } from "components/Buttons";
import { cn } from "utils";
import { useDirT } from "hooks";

export type ToastVariant = "success" | "info" | "warning" | "danger";

interface ExtraProps {
  dir: string;
}

const icons: Record<ToastVariant, FC<SVGProps<SVGSVGElement> & ExtraProps>> = {
  success: SuccessIcon,
  info: InfoIcon,
  warning: WarningIcon,
  danger: DangerIcon,
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
  const dirT = useDirT();
  const Icon = icons[variant];

  return (
    <div className={cn("Toast", variant, { floating })} dir={dir || dirT}>
      {<Icon className="toastIcon iconL" dir={dir || dirT} />}
      <p className="message">{message}</p>
      <CloseButton onClick={close} dir={dir || dirT} />
    </div>
  );
}
