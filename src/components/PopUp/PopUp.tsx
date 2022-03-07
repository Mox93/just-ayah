import { FunctionComponent, ReactNode } from "react";

export interface PopUpProps {
  children?: ReactNode;
  visible?: boolean;
}

const PopUp: FunctionComponent<PopUpProps> = ({ children, visible = true }) => {
  return visible ? (
    <div className="PopUp background">
      <div className="card container">{children}</div>
    </div>
  ) : null;
};

export default PopUp;
