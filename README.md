# alert-my-human

A lightweight, multichannel MCP server that lets agents send alerts — useful for notifying a human when a scheduled job fails, data is missing, or something otherwise needs attention.

Supports email, Slack, Telegram, SMS, and generic webhooks. Enabled a channel by setting its env vars. Callers pick which configured channels to deliver to on each call.

## Tools

### `list_channels`

Returns which channels are currently configured. No params. Call this before `send_alert` to know which channel names are valid.

### `send_alert`

| Param      | Type                              | Required | Description                                                        |
| ---------- | --------------------------------- | -------- | -------------------------------------------------------------------- |
| `channels` | array of channel names            | Yes      | Which channels to deliver to (e.g. `["slack", "email"]`). See `list_channels`. |
| `severity` | `info` \| `success` \| `warning` \| `error` | No (default `info`) | Controls the color/emoji used in the alert.               |
| `title`    | string                            | Yes      | Short headline for the alert.                                        |
| `message`  | string                            | Yes      | Body of the alert.                                                    |
| `context`  | object of string key/value pairs  | No       | Extra details rendered as a list (e.g. job name, error code).        |

## Setup

1. Copy `.env.example` to `.env` and fill in:
   - `AUTH_API_KEY` — any random secret string; callers must send it as `Authorization: Bearer <key>`.
   - Then configure one or more channels (leave a channel's vars unset to disable it):
     - **Email** — `SENDING_EMAIL`, `RESEND_API_KEY` (from [resend.com](https://resend.com)), `ALERT_EMAIL` (one address, or several comma-separated).
     - **Slack** — `SLACK_WEBHOOK_URL` (an [incoming webhook](https://api.slack.com/messaging/webhooks)).
     - **Telegram** — `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`.
     - **SMS** — `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`, `ALERT_PHONE_NUMBER` (from [twilio.com](https://twilio.com)).
     - **Webhook** — `WEBHOOK_URLS`, comma-separated; each receives the alert as JSON.
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

Run `npx @modelcontextprotocol/inspector@latest http://localhost:3000 undefined`, then connect it to `http://localhost:3000/api/mcp` with an `Authorization: Bearer <AUTH_API_KEY>` header.

## Roadmap

- Landing page with prompt to auto deploy via vercel
- Phone call alerts
