import { z } from 'zod';
import { createMcpHandler } from 'mcp-handler';
import { sendEmail } from '@/app/services/email';
import { isAuthorized } from '@/app/services/auth';

const mcpHandler = createMcpHandler(
  (server) => {
    server.registerTool(
      'send_email',
      {
        title: 'Send Email Alert',
        description: 'Send an email alert',
        inputSchema: z.object({
          to: z.email().or(z.array(z.email())),
          subject: z.string(),
          html: z.string(),
        }),
      },
      async ({ to, subject, html }) => {
        const data = await sendEmail(to, subject, html);
        return {
          content: [{ type: 'text', text: `Email sent successfully. ID: ${data?.id || 'unknown'}` }],
        };
      },
    );
  },
  {},
  { basePath: '/api' },
);
 
async function handler(request: Request) {
  if (!isAuthorized(request)) {
    return new Response('Unauthorized', { status: 401 });
  }
  return mcpHandler(request);
}

export { handler as GET, handler as POST, handler as DELETE };