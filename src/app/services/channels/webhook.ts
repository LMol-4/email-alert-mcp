import type { Channel } from './types';

export const webhookChannel: Channel = {
  name: 'webhook',
  isConfigured: () => Boolean(process.env.WEBHOOK_URLS),
  async send(alert) {
    const urls = process.env
      .WEBHOOK_URLS!.split(',')
      .map((url) => url.trim())
      .filter(Boolean);

    const results = await Promise.allSettled(
      urls.map(async (url) => {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(alert),
        });
        if (!res.ok) throw new Error(`${url} → ${res.status}`);
      }),
    );

    const failed = results
      .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
      .map((result) => result.reason.message);
    if (failed.length) throw new Error(failed.join('; '));
  },
};
