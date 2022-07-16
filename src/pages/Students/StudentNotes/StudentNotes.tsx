import { CommentsViewer } from "components/Comments";
import { useStudentContext } from "context";
import { useMessageT } from "hooks";
import { Comment } from "models/comment";
import { FunctionComponent, useEffect, useState } from "react";

interface StudentNotesProps {
  id: string;
}

const StudentNotes: FunctionComponent<StudentNotesProps> = ({ id }) => {
  const {
    data: { students },
    addNote,
  } = useStudentContext();
  const [notes, setNotes] = useState<Comment[]>();
  const msg = useMessageT();

  useEffect(() => {
    setNotes(
      students.find(({ id: studentId }) => id === studentId)?.meta.notes
    );
  }, [students, id]);

  return (
    <CommentsViewer
      comments={notes}
      onCommentAdd={(note: Comment) => addNote(id, note)}
      messageNoComments={msg("noNotes")}
    />
  );
};

export default StudentNotes;
