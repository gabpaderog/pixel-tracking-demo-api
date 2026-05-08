import { mailTransporter } from "../../config/nodemailer.js";
import "dotenv/config";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  return mailTransporter.sendMail({
    from: process.env.MAIL_USER,
    to,
    subject,
    html,
  });
}
