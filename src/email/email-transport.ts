import { createTransport, type Transporter } from "nodemailer"
import SMTPTransport from "nodemailer/lib/smtp-transport"

if (!process.env.GMAIL_USERNAME || !process.env.GMAIL_PASSWORD) {
  throw new Error("Gmail username and password not found in environment variables")
}

// Create a transporter object
export const transporter: Transporter<SMTPTransport.SentMessageInfo> = createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_PASSWORD
  }
})
