import { VFC } from "react";

interface UnauthorizedProps {}

const Unauthorized: VFC<UnauthorizedProps> = () => {
  return (
    <div className="Unauthorized">
      <h1 className="title">401 Unauthorized!</h1>
    </div>
  );
};

export default Unauthorized;
