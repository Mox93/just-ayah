import { FC, ReactElement, SVGProps, VFC } from "react";

import { ReactComponent as DangerIcon } from "assets/icons/block-svgrepo-com.svg";
import { ReactComponent as InfoIcon } from "assets/icons/info-svgrepo-com.svg";
import { ReactComponent as SuccessIcon } from "assets/icons/success-svgrepo-com.svg";
import { ReactComponent as WarningIcon } from "assets/icons/warning-svgrepo-com.svg";
import { CloseButton } from "components/Buttons";
import { cn } from "utils";
import { useDirT } from "hooks";

export type ToastVariant = "success" | "info" | "warning" | "danger";

const icons: Record<ToastVariant, FC<SVGProps<SVGSVGElement>>> = {
  success: SuccessIcon,
  info: InfoIcon,
  warning: WarningIcon,
  danger: DangerIcon,
};

export interface ToastProps {
  message: string | ReactElement;
  variant?: ToastVariant;
  floating?: boolean;
  close?: VoidFunction;
}

const Toast: VFC<ToastProps> = ({
  message,
  floating,
  variant = "info",
  close,
}) => {
  const dirT = useDirT();
  const Icon = icons[variant];

  return (
    <div className={cn("Toast", variant, { floating })} dir={dirT}>
      {<Icon className="toastIcon" {...{ dir: dirT }} />}
      <p className="message">{message}</p>
      <CloseButton onClick={close} />
    </div>
  );
};

export default Toast;
