import {
  DOC_ID_CARD,
  DOC_ID_VAR,
  LOGS_SHEET_ID,
  TEMP_DELETED_PATH,
  TEMP_SESSION_TRACK_PATH,
} from "@config";
import {
  HttpsError,
  Timestamp,
  authClient,
  db,
  document,
  onCall,
  sheets,
} from "@lib";
import { merge } from "@utils";

export interface SessionTrackData {
  teacher: string;
  student: string;
  status: string;
  date: Date;
  timestamp: Date;
  notes?: string;
}

export const onSessionTrackCreate = document(
  TEMP_SESSION_TRACK_PATH(DOC_ID_CARD)
).onCreate(
  merge((snapshot, context) => {
    const id = context.params[DOC_ID_VAR];
    return addLogToSheet(id, snapshot.data() as SessionTrackData);
  })
);

export const deleteSessionTrack = onCall(async (data: { id: string }) => {
  const { id } = data || {};

  if (!id) throw new HttpsError("invalid-argument", "No 'id' was found!");

  return Promise.all([moveToDeleted(id), removeLogFromSheet(id)]);
});

async function addLogToSheet(
  id: string,
  { timestamp, teacher, student, date, status, notes }: SessionTrackData
) {
  const _date = date instanceof Timestamp ? date.toDate() : date;
  const _timestamp =
    timestamp instanceof Timestamp ? timestamp.toDate() : timestamp;

  return sheets.spreadsheets.values.append(
    {
      auth: await authClient,
      spreadsheetId: LOGS_SHEET_ID,
      range: "sessionTrack",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            id,
            _timestamp
              .toLocaleString("en-US", { timeZone: "Africa/Cairo" })
              .replace(",", ""),
            _date.toLocaleDateString(),
            teacher,
            student,
            status,
            notes,
          ],
        ],
        majorDimension: "ROWS",
      },
    },
    {}
  );
}

async function moveToDeleted(id: string) {
  const path = TEMP_SESSION_TRACK_PATH(id);
  const sourceRef = db.doc(path);
  const targetRef = db.collection(TEMP_DELETED_PATH).doc();

  return db.runTransaction(async (t) => {
    const data = (await t.get(sourceRef)).data();

    if (data) {
      t.create(targetRef, { data, path, dateCreated: new Date() });
      t.delete(sourceRef);
    }
  });
}

async function removeLogFromSheet(id: string) {
  const ids =
    (
      await sheets.spreadsheets.values.get(
        {
          auth: await authClient,
          spreadsheetId: LOGS_SHEET_ID,
          range: "id",
        },
        {}
      )
    ).data.values || [];

  for (let i = 0; i < ids.length; i++) {
    if (ids[i][0] !== id) continue;

    return sheets.spreadsheets.batchUpdate(
      {
        auth: await authClient,
        spreadsheetId: LOGS_SHEET_ID,
        requestBody: {
          requests: [
            {
              deleteDimension: {
                range: {
                  dimension: "ROWS",
                  startIndex: i,
                  endIndex: i + 1,
                },
              },
            },
          ],
        },
      },
      {}
    );
  }

  return null;
}
