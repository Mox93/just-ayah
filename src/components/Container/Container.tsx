import { forwardRef, PropsWithChildren, ReactNode, Ref } from "react";

import { useDirT } from "hooks";
import { cn } from "utils";

interface ContainerProps {
  className?: string;
  variant?: "menu" | "card" | "form";
  dir?: string;
  header?: ReactNode;
  footer?: ReactNode;
  flat?: boolean;
}

const Container = (
  {
    className,
    children,
    variant,
    dir,
    header,
    footer,
    flat,
  }: PropsWithChildren<ContainerProps>,
  ref: Ref<HTMLDivElement>
) => {
  const dirT = useDirT();
  const _dir = dir || dirT;

  return (
    <div
      ref={ref}
      className={cn("Container", variant, className, { flat })}
      dir={_dir}
    >
      {header && (
        <div className="header" dir={_dir}>
          {header}
        </div>
      )}
      <div className="body" dir={_dir}>
        {children}
      </div>
      {footer && (
        <div className="footer" dir={_dir}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default forwardRef(Container);
