
import "dotenv/config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export const sendVerificationEmail = async ({
  email,
  name,
  verificationUrl,
}) => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    throw new Error("Gmail SMTP credentials are missing in .env");
  }

  const safeName = String(name || "there")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

  const info = await transporter.sendMail({
    from: `"CivicRouteX" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Verify your CivicRouteX account",
    text: `Hello ${name}, verify your CivicRouteX account using this link: ${verificationUrl}. This link expires in 24 hours.`,
    html: `
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
              <a href="${verificationUrl}"
                 style="display:inline-block;background:#0d9488;color:white;padding:13px 22px;border-radius:8px;text-decoration:none;font-weight:bold;">
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
    `,
  });

  console.log("Verification email sent:", info.messageId);
  return info;
};
