import { google, sheets_v4 } from "googleapis";

export const sheets = google.sheets("v4");
export const authClient = google.auth.getClient({
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

export type Schema$ValueRange = sheets_v4.Schema$ValueRange;
