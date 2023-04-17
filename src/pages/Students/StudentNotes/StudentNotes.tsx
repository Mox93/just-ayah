import { useMemo } from "react";

import { CommentsViewer } from "components/Comments";
import { useStudentContext } from "context";
import { useGlobalT, useMessageT } from "hooks";
import { Comment } from "models/blocks";

interface StudentNotesProps {
  id: string;
}

export default function StudentNotes({ id }: StudentNotesProps) {
  const msg = useMessageT();
  const glb = useGlobalT();

  const { students, addNote } = useStudentContext();

  const notes = useMemo<Comment[] | undefined>(
    () => students.find(({ id: _id }) => id === _id)?.meta.notes,
    [id, students]
  );

  return (
    <CommentsViewer
      comments={notes}
      onAddComment={(note, reset) =>
        addNote(id, note, { onFulfilled: () => reset() })
      }
      placeholder={msg("noNotes")}
      header={glb("notes")}
    />
  );
}
