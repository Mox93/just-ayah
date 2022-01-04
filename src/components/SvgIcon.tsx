import { FunctionComponent } from "react";

interface SvgIconProps {
  href?: string;
}

const SvgIcon: FunctionComponent<SvgIconProps> = ({ href }) => {
  return (
    <svg className="shrunk" viewBox="0 0 32 32">
      <use href={href}></use>
    </svg>
  );
};

export default SvgIcon;
