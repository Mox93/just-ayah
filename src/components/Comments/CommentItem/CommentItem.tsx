import Ellipsis from "components/Ellipsis";
import Avatar from "components/Icons/Avatar";
import { useDirT } from "hooks";
import { Comment } from "models/blocks";
import { historyRep } from "models/_blocks";

interface CommentItemProps {
  comment: Comment;
  dir?: string;
}

export default function CommentItem({
  comment: { body, dateCreated, createdBy },
  dir,
}: CommentItemProps) {
  const { displayName, photoURL } = createdBy || {};
  const dirT = useDirT();

  return (
    <div className="CommentItem" dir={dir || dirT}>
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
