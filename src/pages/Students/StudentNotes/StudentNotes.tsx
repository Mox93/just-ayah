import NotesViewer from "components/NotesViewer";
import { useStudents } from "context/Students";
import { Note } from "models/note";
import { FunctionComponent, useEffect, useState } from "react";

interface StudentNotesProps {
  studentId: string;
}

const StudentNotes: FunctionComponent<StudentNotesProps> = ({ studentId }) => {
  const { data, updateStudent } = useStudents();
  const [notes, setNotes] = useState<Note[]>();

  const addNote = (note: Note) => {
    updateStudent(studentId, { notes: [note, ...(notes || [])] });
  };

  useEffect(() => {
    setNotes(data.find((student) => student.id === studentId)?.notes);
  }, [data, studentId]);

  return <NotesViewer notes={notes} onNoteAdded={(note) => addNote(note)} />;
};

export default StudentNotes;
