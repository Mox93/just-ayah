import { authClient, sheets } from "@lib";

export async function addRowToSheet(
  spreadsheetId: string,
  range: string,
  row: (string | undefined)[]
) {
  return await sheets.spreadsheets.values.append(
    {
      auth: await authClient,
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [row],
        majorDimension: "ROWS",
      },
    },
    {}
  );
}

export async function changeRowInSheet(
  spreadsheetId: string,
  sheetName: string,
  id: string,
  row: (string | undefined)[]
) {
  const i = await getIdIndex(spreadsheetId, sheetName, id);

  return i >= 0
    ? await sheets.spreadsheets.values.update(
        {
          auth: await authClient,
          spreadsheetId,
          range: `'${sheetName}'!A${i + 1}`,
          valueInputOption: "USER_ENTERED",
          requestBody: {
            values: [row],
            majorDimension: "ROWS",
          },
        },
        {}
      )
    : null;
}

export async function removeRowFromSheet(
  spreadsheetId: string,
  sheetName: string,
  sheetId: number,
  id: string
) {
  const i = await getIdIndex(spreadsheetId, sheetName, id);

  return i >= 0
    ? await sheets.spreadsheets.batchUpdate(
        {
          auth: await authClient,
          spreadsheetId,
          requestBody: {
            requests: [
              {
                deleteDimension: {
                  range: {
                    sheetId,
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
      )
    : null;
}

export async function getIdIndex(
  spreadsheetId: string,
  sheetName: string,
  id: string
) {
  const ids =
    (
      await sheets.spreadsheets.values.get(
        {
          auth: await authClient,
          spreadsheetId,
          range: `'${sheetName}'!A:A`,
        },
        {}
      )
    ).data.values || [];

  for (let i = 0; i < ids.length; i++) {
    if (ids[i][0] === id) return i;
  }

  return -1;
}
