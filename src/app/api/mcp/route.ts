import { z } from 'zod';
import { createMcpHandler } from 'mcp-handler';
import { isAuthorized } from '@/app/services/auth';
import { CHANNELS } from '@/app/services/channels';

const mcpHandler = createMcpHandler(
  (server) => {
    server.registerTool(
      'send_alert',
      {
        title: 'Send Alert',
        description:
          'Send an alert. Use this to notify a human when something needs their attention (a job failed, data is missing, a task succeeded, etc). Delivered to every configured channel (email, Slack, Telegram, SMS, webhooks).',
        inputSchema: z.object({
          severity: z.enum(['info', 'success', 'warning', 'error']).default('info'),
          title: z.string().describe('Short headline for the alert.'),
          message: z.string().describe('The body of the alert.'),
          context: z
            .record(z.string(), z.string())
            .optional()
            .describe('Optional key/value details shown alongside the message (e.g. job name, error code).'),
        }),
      },
      async ({ severity, title, message, context }) => {
        const channels = CHANNELS.filter((channel) => channel.isConfigured());
        if (!channels.length) {
          throw new Error('No alert channels are configured. Set at least one channel\'s env vars — see .env.example.');
        }

        const alert = { severity, title, message, context };
        const results = await Promise.allSettled(channels.map((channel) => channel.send(alert)));

        const sent = channels.filter((_, i) => results[i].status === 'fulfilled').map((channel) => channel.name);
        const failed = results
          .map((result, i) => ({ result, name: channels[i].name }))
          .filter(({ result }) => result.status === 'rejected')
          .map(({ result, name }) => `${name} (${(result as PromiseRejectedResult).reason})`);

        const summary = [
          sent.length ? `Sent via: ${sent.join(', ')}.` : '',
          failed.length ? `Failed: ${failed.join(', ')}.` : '',
        ]
          .filter(Boolean)
          .join(' ');

        return { content: [{ type: 'text', text: summary }] };
      },
    );
  },
  {},
  { basePath: '/api' },
);

async function handler(request: Request) {
  if (!isAuthorized(request)) {
    return new Response('Unauthorized', { status: 401, headers: { 'WWW-Authenticate': 'Bearer' } });
  }
  return mcpHandler(request);
}

export { handler as GET, handler as POST, handler as DELETE };
