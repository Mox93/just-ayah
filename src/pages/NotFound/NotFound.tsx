import { VFC } from "react";

interface NotFoundProps {}

const NotFound: VFC<NotFoundProps> = () => {
  return (
    <div className="NotFound">
      <h1 className="title">404 Not Found!</h1>
    </div>
  );
};

export default NotFound;
