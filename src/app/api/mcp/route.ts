import { z } from 'zod';
import { createMcpHandler } from 'mcp-handler';
import { sendEmail } from '@/app/services/email';
import { isAuthorized } from '@/app/services/auth';
import { renderAlertEmail } from '@/app/alertTemplate';

const mcpHandler = createMcpHandler(
  (server) => {
    server.registerTool(
      'send_alert',
      {
        title: 'Send Alert',
        description:
          'Send an alert email. Use this to notify a human when something needs their attention (a job failed, data is missing, a task succeeded, etc).',
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
        const recipient = process.env.ALERT_EMAIL;
        if (!recipient) {
          throw new Error('ALERT_EMAIL is not configured on the server.');
        }

        const { subject, html, text } = renderAlertEmail({ severity, title, message, context });
        const data = await sendEmail(recipient, subject, html, text);
        return {
          content: [{ type: 'text', text: `Alert sent successfully. ID: ${data?.id || 'unknown'}` }],
        };
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
