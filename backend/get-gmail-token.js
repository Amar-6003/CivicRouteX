import { authenticate } from "@google-cloud/local-auth";
import { google } from "googleapis";
import path from "node:path";

const auth = await authenticate({
  browser: "chrome",
  scopes: ["https://www.googleapis.com/auth/gmail.send"],
  keyfilePath: path.join(process.cwd(), "credentials.json"),
});

const oauth2 = google.auth.OAuth2;
const credentials = auth.credentials;

console.log("Refresh token:", credentials.refresh_token);
