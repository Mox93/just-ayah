import { PropsWithChildren, Suspense } from "react";

import LoadingPopup from "components/LoadingPopup";
import { useGlobalT } from "hooks";

interface AwaitProps extends PropsWithChildren {
  subject?: string;
}

export default function Await({ children, subject = "" }: AwaitProps) {
  const glb = useGlobalT();
  return (
    <Suspense
      fallback={
        <LoadingPopup message={glb("loading") + (subject && ` ${subject}`)} />
      }
    >
      {children}
    </Suspense>
  );
}
