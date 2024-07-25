import { Transporter } from 'nodemailer';

export type MailOptions = {
  from: string;
  to: string;
  subject: string;
  html: string;
};

export type MailResult = {
  error: boolean;
  message: string;
  to: string;
  subject: string;
};

export const subjectPrefix = process.env.GMAIL_SUBJECT_PREFIX ?? 'Preview Test Email';

/**
 * @description Send an email using the mail options and transport object
 */
export async function sendEmail(
  mailOptions: MailOptions,
  transport: Transporter
): Promise<MailResult> {
  const sendMailOptions = {
    from: mailOptions.from,
    to: mailOptions.to,
    subject: subjectPrefix + ' - ' + mailOptions.subject,
    html: mailOptions.html,
  };
  let result = {
    error: true,
    message: 'Email not sent',
    to: mailOptions.to,
    subject: mailOptions.subject,
  };
  const emailResponse = await transport.sendMail(sendMailOptions);
  if (emailResponse.error) {
    result.message = 'Error: ' + emailResponse.error;
  } else {
    result.error = false;
    result.message = 'Email sent: ' + emailResponse.response;
  }
  return result as MailResult;
}
