import { VFC } from "react";

import { formAtoms } from "components/Form";
import { useAuthContext } from "context";
import { useGlobalT, useMessageT } from "hooks";
import { Comment } from "models/comment";

import CommentItem from "../CommentItem";

type CommentInfo = { draft: string };

const { Form, Textarea } = formAtoms<CommentInfo>();

interface CommentsViewerProps {
  comments?: Comment[];
  storageKey?: string;
  messageNoComments?: string;
  onCommentAdd: (comment: Comment) => void;
}

const CommentsViewer: VFC<CommentsViewerProps> = ({
  comments,
  storageKey,
  messageNoComments,
  onCommentAdd,
}) => {
  const glb = useGlobalT();
  const msg = useMessageT();
  const { user } = useAuthContext();

  const addComment = ({ draft }: CommentInfo) => {
    const comment: Comment = {
      dateCreated: new Date(),
      ...(user?.email && {
        createdBy: {
          email: user.email,
          ...(user.displayName && { username: user.displayName }),
          ...(user.photoURL && { avatar: user.photoURL }),
        },
      }),
      body: draft,
    };

    console.log(comment);

    onCommentAdd(comment);
  };

  return (
    <div className="CommentsViewer">
      <Form
        submitProps={{ children: glb("save") }}
        resetProps={{ children: glb("cancel") }}
        onSubmit={addComment}
        storageKey={storageKey}
      >
        <Textarea name="draft" />
      </Form>
      {comments ? (
        <div className="list">
          {comments.map((comment) => (
            <CommentItem data={comment} key={comment.dateCreated.getTime()} />
          ))}
        </div>
      ) : (
        <h4 className="noComments">{messageNoComments || msg("noComments")}</h4>
      )}
    </div>
  );
};

export default CommentsViewer;
