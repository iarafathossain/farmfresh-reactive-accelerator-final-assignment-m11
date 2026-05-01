import nodemailer from "nodemailer";
import { env } from "@/config/env";

export const createTransport = () => {
  return nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: false,
    auth: { user: env.smtp.user, pass: env.smtp.pass },
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
  const from = env.smtp.from;
  const info = await transporter.sendMail({ from, ...opts });
  return info;
}
