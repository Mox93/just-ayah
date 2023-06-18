import Container from "components/Container";
import { formAtoms } from "components/Form";
import { useAuthContext } from "context";
import { useGlobalT, useMessageT } from "hooks";
import { Comment, commentSchema } from "models/blocks";

import CommentItem from "../CommentItem";

interface CommentForm {
  draft: string;
}

const { Form, Textarea, useForm } = formAtoms<CommentForm>();

interface CommentsViewerProps {
  comments?: Comment[];
  storageKey?: string;
  placeholder?: string;
  header?: string;
  onAddComment: (comment: Comment, reset: VoidFunction) => void;
}

export default function CommentsViewer({
  comments,
  storageKey,
  placeholder,
  header,
  onAddComment,
}: CommentsViewerProps) {
  const glb = useGlobalT();
  const msg = useMessageT();
  const { user } = useAuthContext();

  const formProps = useForm({
    onSubmit: ({ draft }, { reset }) =>
      // TODO use safeParse and handle error state
      onAddComment(commentSchema.parse({ body: draft, user }), reset),
    ...(storageKey ? { storage: { key: storageKey } } : {}),
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
}
