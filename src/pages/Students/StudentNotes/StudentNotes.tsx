import { CommentsViewer } from "components/Comments";
import { useStudentContext } from "context";
import { useGlobalT, useMessageT } from "hooks";
import { Comment } from "models/blocks";
import { VFC, useEffect, useState } from "react";

interface StudentNotesProps {
  id: string;
}

const StudentNotes: VFC<StudentNotesProps> = ({ id }) => {
  const { students, addNote } = useStudentContext();
  const [notes, setNotes] = useState<Comment[] | undefined>(
    () => students.find(({ id: studentId }) => id === studentId)?.meta.notes
  );
  const msg = useMessageT();
  const glb = useGlobalT();

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
      header={glb("notes")}
    />
  );
};

export default StudentNotes;
