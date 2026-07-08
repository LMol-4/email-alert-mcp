# email-alert-mcp

A lightweight MCP server that lets agents send email alerts — useful for notifying a human when a scheduled job fails, data is missing, or something otherwise needs attention.

## Tool

### `send_alert`

| Param      | Type                              | Required | Description                                                        |
| ---------- | --------------------------------- | -------- | -------------------------------------------------------------------- |
| `to`       | email or array of emails          | No       | Defaults to `ALERT_EMAIL` if omitted.                                 |
| `severity` | `info` \| `success` \| `warning` \| `error` | No (default `info`) | Controls the color/emoji used in the email.               |
| `title`    | string                            | Yes      | Short headline for the alert.                                        |
| `message`  | string                            | Yes      | Body of the alert.                                                    |
| `context`  | object of string key/value pairs  | No       | Extra details rendered as a list (e.g. job name, error code).        |

## Setup

1. Copy `.env.example` to `.env` and fill in:
   - `SENDING_EMAIL` — the "from" address (must be on a domain verified with Resend).
   - `RESEND_API_KEY` — from [resend.com](https://resend.com) (Nice free tier).
   - `AUTH_API_KEY` — any random secret string; callers must send it as `Authorization: Bearer <key>`.
   - `ALERT_EMAIL` — default recipient (optional, but recommended so callers don't need to pass `to` every time).
2. `pnpm install`
3. `pnpm dev`

## Connecting an MCP client

Register the server with a static bearer token header, for example in Claude Code's `mcpServers` config:

```json
{
  "type": "http",
  "url": "https://your-deployment.example.com/api/mcp",
  "headers": {
    "Authorization": "Bearer <AUTH_API_KEY>"
  }
}
```

## Testing

Test with `npx @modelcontextprotocol/inspector@latest http://localhost:3000 undefined`
