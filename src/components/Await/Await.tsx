import { FC, Suspense } from "react";

import LoadingPopup from "components/LoadingPopup";
import { useGlobalT } from "hooks";

interface AwaitProps {
  subject?: string;
}

const Await: FC<AwaitProps> = ({ children, subject = "" }) => {
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
};

export default Await;
