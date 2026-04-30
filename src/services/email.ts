import nodemailer from "nodemailer";

export const createTransport = () => {
  const host = process.env.SMTP_HOST!;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER!;
  const pass = process.env.SMTP_PASS!;
  if (!host || !user || !pass) {
    throw new Error("SMTP environment variables are not set.");
  }
  return nodemailer.createTransport({
    host,
    port,
    secure: false,
    auth: { user, pass },
  });
};

export type MailAttachment = {
  filename: string;
  content: Buffer | string;
  contentType?: string;
};

export async function sendMail(opts: {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: MailAttachment[];
}) {
  const skip = "true";

  if (skip) {
    console.log("Email sending skipped. Email content:", opts);
    return { messageId: "skipped" };
  }
  const transporter = createTransport();
  const from = process.env.MAIL_FROM || process.env.SMTP_USER!;
  const info = await transporter.sendMail({ from, ...opts });
  return info;
}
