import { dateFromDB, DateInDB } from "models/dateTime";

export interface Note {
  dateCreated: Date;
  dateUpdated?: Date;
  body: string;
  createdBy?: { email: string; username?: string | null };
}

export interface NoteMap {
  [timestamp: string]: Omit<Note, "dateCreated">;
}

export interface NoteInDB extends Omit<Note, "dateCreated" | "dateUpdated"> {
  dateUpdated?: DateInDB;
}

export interface NoteMapInDB {
  [timestamp: string]: NoteInDB;
}

export const noteFromDB = (timestamp: string, note: NoteInDB): Note => {
  const dateCreated = new Date(timestamp);
  const dateUpdated = note.dateUpdated && dateFromDB(note.dateUpdated);
  const result: Note = { ...note, dateCreated, dateUpdated };

  if (result.dateUpdated === undefined) {
    delete result.dateUpdated;
  }

  return result;
};

export const noteListFromDB = (notes: NoteMapInDB): Note[] => {
  const timestamps = Object.keys(notes);
  timestamps.sort((a, b) => (a < b ? 1 : a === b ? 0 : -1));

  return timestamps.map((ts) => noteFromDB(ts, notes[ts]));
};

export const toNoteMap = (notes: Note[]): NoteMap => {
  const noteMap: NoteMap = {};

  notes.forEach((note) => {
    const { dateCreated, ...rest } = note;
    noteMap[`${dateCreated.getTime()}`] = rest;
  });

  return noteMap;
};
