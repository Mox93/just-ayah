import { useEffect } from "react";

import { usePopupContext } from "context";
import { LoadingProps } from "context/Popup/Loading";

export default function LoadingPopup({ message }: LoadingProps) {
  const { startLoading, stopLoading } = usePopupContext();

  useEffect(() => {
    startLoading(message);

    return stopLoading;
  }, [message]);

  return null;
}
