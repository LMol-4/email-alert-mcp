import { CHANNELS } from '@/app/services/channels';
import type { AlertInput } from '@/app/services/alert';

const CHANNEL_NAMES = CHANNELS.map((channel) => channel.name);

export function listChannels() {
  const configured = CHANNELS.filter((channel) => channel.isConfigured()).map((channel) => channel.name);
  const text = configured.length
    ? `Configured channels: ${configured.join(', ')}.`
    : 'No channels are configured. Set env vars for at least one channel — see .env.example.';
  return { content: [{ type: 'text' as const, text }] };
}

export async function sendAlert(input: {
  channels: string[];
  severity: AlertInput['severity'];
  title: string;
  message: string;
  context?: Record<string, string>;
}) {
  const { channels, ...alert } = input;
  const requested = [...new Set(channels)];
  const unknown = requested.filter((name) => !CHANNEL_NAMES.includes(name));
  const targets = CHANNELS.filter((channel) => requested.includes(channel.name));
  const unconfigured = targets.filter((channel) => !channel.isConfigured());
  const ready = targets.filter((channel) => channel.isConfigured());

  const results = await Promise.allSettled(ready.map((channel) => channel.send(alert)));

  const sent = ready.filter((_, i) => results[i].status === 'fulfilled').map((channel) => channel.name);
  const failed = [
    ...ready
      .map((channel, i) => ({ channel, result: results[i] }))
      .filter(({ result }) => result.status === 'rejected')
      .map(({ channel, result }) => `${channel.name} (${(result as PromiseRejectedResult).reason})`),
    ...unconfigured.map((channel) => `${channel.name} (not configured)`),
    ...unknown.map((name) => `${name} (unknown channel)`),
  ];

  const summary = [
    sent.length ? `Sent via: ${sent.join(', ')}.` : '',
    failed.length ? `Failed: ${failed.join(', ')}.` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return { content: [{ type: 'text' as const, text: summary }] };
}
