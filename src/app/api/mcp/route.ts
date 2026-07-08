import { z } from 'zod';
import { createMcpHandler } from 'mcp-handler';
import { sendEmail } from '@/app/services/email';

const handler = createMcpHandler(
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
 
export { handler as GET, handler as POST, handler as DELETE };