import { VFC } from "react";

import { Comment } from "models/comment";
import { useDirT } from "hooks";
import Avatar from "components/Icons/Avatar";
import { historyRep } from "models/dateTime";
import Ellipsis from "components/Ellipsis";

interface CommentItemProps {
  data: Comment;
  dir?: string;
}

const CommentItem: VFC<CommentItemProps> = ({ data, dir }) => {
  const dirT = useDirT();

  return (
    <div className="CommentItem" dir={dir || dirT}>
      <div className="header">
        <Avatar url={data.createdBy?.avatar} />
        <div className="userInfo">
          <Ellipsis component="h3" dir="auto" className="username">
            {data.createdBy?.username}
          </Ellipsis>
          <div className="divider" />
          <Ellipsis component="h5" dir="ltr" className="timestamp">
            {historyRep(data.dateCreated)}
          </Ellipsis>
        </div>
      </div>
      <p className="body" dir="auto">
        {data.body}
      </p>
    </div>
  );
};

export default CommentItem;
