
import "dotenv/config";
import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const gmail = google.gmail({
  version: "v1",
  auth: oauth2Client,
});

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const encodeSubject = (subject) =>
  `=?UTF-8?B?${Buffer.from(subject).toString("base64")}?=`;

export const sendVerificationEmail = async ({
  email,
  name,
  verificationUrl,
}) => {
  if (
    !process.env.GMAIL_USER ||
    !process.env.GOOGLE_CLIENT_ID ||
    !process.env.GOOGLE_CLIENT_SECRET ||
    !process.env.GOOGLE_REFRESH_TOKEN
  ) {
    throw new Error("Gmail API environment variables are missing");
  }

  const safeName = escapeHtml(name || "there");
  const safeUrl = escapeHtml(verificationUrl);

  const html = `
    <!DOCTYPE html>
    <html>
      <body style="margin:0;padding:0;background:#edf5f1;font-family:Arial,sans-serif;">
        <div style="max-width:600px;margin:40px auto;background:white;border-radius:16px;padding:32px;">
          <h2 style="margin:0;color:#0d9488;">Welcome to CivicRouteX</h2>
          <p style="color:#334155;margin-top:24px;">Hello ${safeName},</p>
          <p style="color:#475569;line-height:1.6;">
            Verify your email address before logging in and submitting a public grievance.
          </p>
          <p style="margin:30px 0;">
            <a href="${safeUrl}" style="display:inline-block;background:#0d9488;color:white;padding:13px 22px;border-radius:8px;text-decoration:none;font-weight:bold;">
              Verify Email
            </a>
          </p>
          <p style="color:#64748b;font-size:13px;">
            This verification link expires after 24 hours.
          </p>
          <p style="color:#94a3b8;font-size:12px;">
            If you did not create this account, ignore this email.
          </p>
        </div>
      </body>
    </html>
  `;

  const message = [
    `From: CivicRouteX <${process.env.GMAIL_USER}>`,
    `To: ${email}`,
    `Subject: ${encodeSubject("Verify your CivicRouteX account")}`,
    "MIME-Version: 1.0",
    'Content-Type: text/html; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
    "",
    Buffer.from(html, "utf8").toString("base64"),
  ].join("\r\n");

  const raw = Buffer.from(message, "utf8")
    .toString("base64url");

  const response = await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw },
  });

  console.log("Verification email sent:", response.data.id);
  return response.data;
};
