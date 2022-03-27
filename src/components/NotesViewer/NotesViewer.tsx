import InputField from "components/InputField";
import { useAuth } from "context/Auth";
import { UNKNOWN } from "models";
import { historyRep } from "models/dateTime";
import { Note } from "models/note";
import { FunctionComponent, useEffect, useState } from "react";
import { useGlobalT } from "utils/translation";

interface NotesViewerProps {
  notes?: Note[];
  onNoteAdded: (note: Note) => void;
}

const NotesViewer: FunctionComponent<NotesViewerProps> = ({
  notes = [],
  onNoteAdded,
}) => {
  const glb = useGlobalT();
  const { user } = useAuth();

  const [draft, setDraft] = useState("");
  const [newNote, setNewNote] = useState(false);

  const addNote = () => {
    const note: Note = {
      dateCreated: new Date(),
      ...(user?.email
        ? { createdBy: { email: user.email!, username: user.displayName } }
        : {}),
      body: draft,
    };

    onNoteAdded(note);
    close();
  };

  const close = () => {
    setNewNote(false);
    setDraft("");
  };

  useEffect(() => {
    if (!notes.length) setNewNote(true);
  }, [notes.length]);

  return (
    <div className="NotesViewer">
      {newNote ? (
        <div className="new">
          <InputField
            label={glb("newNote")}
            placeholder={`${glb("writeNoteHere")} ...`}
            value={draft}
            onChange={(value) => setDraft(value)}
            autoFocus
          />
          <div className="actions">
            <button className="save" onClick={addNote} disabled={!draft} />
            <button className="cancel" onClick={close} />
          </div>
        </div>
      ) : (
        <button className="newNote" onClick={() => setNewNote(true)}>
          {glb("newNote")}
        </button>
      )}

      <div className="list">
        {notes.map((note) => {
          return (
            <div
              key={`${note.dateCreated.getTime()}`}
              className="noteItem"
              dir="ltr"
            >
              <h3 className="username">
                {note.createdBy?.username || UNKNOWN}
              </h3>
              <h5 className="dateCreated">{historyRep(note.dateCreated)}</h5>
              <p className="body" dir="auto">
                {note.body}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotesViewer;
