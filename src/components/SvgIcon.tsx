import { FunctionComponent } from "react";

interface SvgIconProps {
  href?: string;
  className?: string;
}

const SvgIcon: FunctionComponent<SvgIconProps> = ({ href, className }) => {
  return (
    <svg className={className} viewBox="0 0 32 32">
      <use href={href}></use>
    </svg>
  );
};

export default SvgIcon;
