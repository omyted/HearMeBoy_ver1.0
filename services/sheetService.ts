
// Service to handle Google Sheets Logging
// Requires: Access Token with 'https://www.googleapis.com/auth/spreadsheets' scope

const SPREADSHEET_ID = process.env.SPREADSHEET_ID || ''; // Ensure this env var is set

export interface UserInfo {
  name: string;
  email: string;
}

export const logUserToSheet = async (accessToken: string, userInfo: UserInfo): Promise<boolean> => {
  if (!SPREADSHEET_ID) {
    console.error("SPREADSHEET_ID not set");
    return false;
  }

  const today = new Date();
  const sheetName = today.toISOString().split('T')[0]; // YYYY-MM-DD

  try {
    // 1. Check if sheet exists
    const metadataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}`;
    const metadataRes = await fetch(metadataUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    
    if (!metadataRes.ok) throw new Error('Failed to fetch spreadsheet metadata');
    
    const metadata = await metadataRes.json();
    const sheetExists = metadata.sheets.some((s: any) => s.properties.title === sheetName);

    // 2. Create sheet if it doesn't exist
    if (!sheetExists) {
      const addSheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}:batchUpdate`;
      await fetch(addSheetUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [
            {
              addSheet: {
                properties: { title: sheetName },
              },
            },
          ],
        }),
      });
      
      // Optional: Add headers to new sheet
      const appendHeaderUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${sheetName}!A1:append?valueInputOption=USER_ENTERED`;
      await fetch(appendHeaderUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [['Timestamp', 'Name', 'Email', 'Login Method']],
        }),
      });
    }

    // 3. Append User Info
    const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${sheetName}!A1:append?valueInputOption=USER_ENTERED`;
    const timestamp = new Date().toLocaleString();
    
    const appendRes = await fetch(appendUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [[timestamp, userInfo.name, userInfo.email, 'Google OAuth']],
      }),
    });

    return appendRes.ok;

  } catch (error) {
    console.error("Error logging to Google Sheet:", error);
    return false;
  }
};