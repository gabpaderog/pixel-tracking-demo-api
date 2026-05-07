import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

export const mailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_APP_PASSWORD,
  },
});