import { useEffect } from "react";

import { startLoading, stopLoading } from "context";
import { LoadingProps } from "context/Popup/Loading";

export default function LoadingPopup({ message }: LoadingProps) {
  useEffect(() => {
    startLoading(message);

    return stopLoading;
  }, [message]);

  return null;
}
