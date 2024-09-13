import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import crypto from 'crypto';

function getPrivateKey(): string {
  const key = process.env.GOOGLE_PRIVATE_KEY;
  if (!key) {
    throw new Error('errrrr');
  }
  // remove any extra quotes from the key string and replace \\n with actual newlines
  return key.replace(/\\n/g, '\n').replace(/^"(.*)"$/, '$1');
}

export async function saveEmail(email: string): Promise<void> {
  const privateKey = getPrivateKey();
  const auth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const doc = new GoogleSpreadsheet(
    process.env.GOOGLE_SHEET_ID as string,
    auth
  );
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  await sheet.addRow({ email, timestamp: new Date().toISOString() });
}

export async function generateDownloadToken(): Promise<string> {
  //  (email: string)
  const token = crypto.randomBytes(32).toString('hex');
  return token;
}

export async function verifyDownloadToken(): Promise<boolean> {
  // (token: string)
  return true;
}
