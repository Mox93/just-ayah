import { VFC } from "react";

import Container from "components/Container";
import { formAtoms } from "components/Form";
import { useAuthContext } from "context";
import { useGlobalT, useMessageT, useSmartForm } from "hooks";
import { Comment, commentSchema } from "models/blocks";

import CommentItem from "../CommentItem";

interface CommentForm {
  draft: string;
}

const { Form, Textarea } = formAtoms<CommentForm>();

interface CommentsViewerProps {
  comments?: Comment[];
  storageKey?: string;
  placeholder?: string;
  header?: string;
  onAddComment: (comment: Comment) => void;
}

const CommentsViewer: VFC<CommentsViewerProps> = ({
  comments,
  storageKey,
  placeholder,
  header,
  onAddComment,
}) => {
  const glb = useGlobalT();
  const msg = useMessageT();
  const { user } = useAuthContext();

  const formProps = useSmartForm<CommentForm>({
    onSubmit: ({ draft }) =>
      // TODO use safeParse and handle error state
      onAddComment(commentSchema.parse({ body: draft, user })),
    ...(storageKey ? { storage: { key: storageKey } } : {}),
    resetOnSubmit: true,
  });

  return (
    <Container
      variant="card"
      className="CommentsViewer"
      header={<h2 className="title">{header || glb("comments")}</h2>}
    >
      <Form
        submitProps={{ children: glb("save") }}
        resetProps={{ children: glb("clear") }}
        {...formProps}
      >
        <Textarea name="draft" rules={{ required: "noText" }} />
      </Form>
      {comments ? (
        <div className="list">
          {comments.map((comment) => (
            <CommentItem
              comment={comment}
              key={comment.dateCreated.getTime()}
            />
          ))}
        </div>
      ) : (
        <h4 className="noComments">{placeholder || msg("noComments")}</h4>
      )}
    </Container>
  );
};

export default CommentsViewer;
