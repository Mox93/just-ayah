import { FunctionComponent } from "react";

interface SvgIconProps {
  path?: string;
  id?: string;
  className?: string;
}

const SvgIcon: FunctionComponent<SvgIconProps> = ({
  id = "Main",
  path,
  className,
}) => {
  return (
    <svg className={className} viewBox="0 0 32 32">
      <use href={`${path}/#${id}`}></use>
    </svg>
  );
};

export default SvgIcon;
