import { useEffect, VFC } from "react";

import LoadingSpinner from "components/Icons/LoadingSpinner";
import { usePopupContext } from "context";

interface LoadingPopupProps {
  message?: string;
}

const LoadingPopup: VFC<LoadingPopupProps> = ({ message }) => {
  const { showPopup, closePopup } = usePopupContext();

  useEffect(() => {
    showPopup(
      <div className="LoadingPopup">
        {message}
        <LoadingSpinner />
      </div>
    );

    return closePopup;
  }, []);

  return null;
};

export default LoadingPopup;
