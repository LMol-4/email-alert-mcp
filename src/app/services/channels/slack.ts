import { renderSlack } from '@/app/services/alert';
import type { Channel } from './types';
import { fetchWithRetry, truncateBody } from './http';

export const slackChannel: Channel = {
  name: 'slack',
  isConfigured: () => Boolean(process.env.SLACK_WEBHOOK_URL),
  async send(alert) {
    const res = await fetchWithRetry(process.env.SLACK_WEBHOOK_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(renderSlack(alert)),
    });
    if (!res.ok) throw new Error(`${res.status} ${truncateBody(await res.text())}`);
  },
};
