import { VFC } from "react";

import { ReactComponent as WarningSign } from "assets/icons/warning-sign-svgrepo-com.svg";

interface WarningProps {}

const Warning: VFC<WarningProps> = () => {
  return <WarningSign className="Warning" />;
};

export default Warning;
