import { Resend } from 'resend';
import { renderEmail } from '@/app/services/alert';
import type { Channel } from './types';

const resend = new Resend(process.env.RESEND_API_KEY);

export const emailChannel: Channel = {
  name: 'email',
  isConfigured: () => Boolean(process.env.RESEND_API_KEY && process.env.SENDING_EMAIL && process.env.ALERT_EMAIL),
  async send(alert) {
    const { subject, html, text } = renderEmail(alert);
    const to = process.env
      .ALERT_EMAIL!.split(',')
      .map((address) => address.trim())
      .filter(Boolean);

    const { error } = await resend.emails.send({
      from: `Alert <${process.env.SENDING_EMAIL}>`,
      to,
      subject,
      html,
      text,
    });
    if (error) throw new Error(error.message);
  },
};
