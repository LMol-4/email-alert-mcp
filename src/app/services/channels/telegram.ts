import { renderText } from '@/app/services/alert';
import type { Channel } from './types';

export const telegramChannel: Channel = {
  name: 'telegram',
  isConfigured: () => Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID),
  async send(alert) {
    const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text: renderText(alert) }),
    });
    if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  },
};
