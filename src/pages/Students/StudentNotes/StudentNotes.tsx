import { VFC, useEffect, useState } from "react";

import { CommentsViewer } from "components/Comments";
import { useStudentContext } from "context";
import { useGlobalT, useMessageT } from "hooks";
import { Comment } from "models/blocks";

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
      onAddComment={(note) => addNote(id, note)}
      placeholder={msg("noNotes")}
      header={glb("notes")}
    />
  );
};

export default StudentNotes;
