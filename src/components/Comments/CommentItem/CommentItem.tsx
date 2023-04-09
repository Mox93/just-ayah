import Ellipsis from "components/Ellipsis";
import Avatar from "components/Icons/Avatar";
import { Comment } from "models/blocks";
import { historyRep } from "models/_blocks";

interface CommentItemProps {
  comment: Comment;
}

export default function CommentItem({
  comment: { body, dateCreated, createdBy },
}: CommentItemProps) {
  const { displayName, photoURL } = createdBy || {};

  return (
    <div className="CommentItem">
      <div className="header">
        <Avatar url={photoURL} />
        <div className="userInfo">
          {displayName && (
            <Ellipsis Component="h3" dir="auto" className="username">
              {displayName}
            </Ellipsis>
          )}
          <div className="divider" />
          <Ellipsis Component="h5" dir="ltr" className="timestamp">
            {historyRep(dateCreated)}
          </Ellipsis>
        </div>
      </div>
      <p className="body" dir="auto">
        {body}
      </p>
    </div>
  );
}
