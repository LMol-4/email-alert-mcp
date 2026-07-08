import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = `Alert <${process.env.SENDING_EMAIL}>`;

export async function sendEmail(to: string | string[], subject: string, html: string, text?: string) {
  const { data, error } = await resend.emails.send({ from: FROM, to, subject, html, text });
  if (error) throw new Error(`Failed to send email: ${error.message}`);
  return data;
}