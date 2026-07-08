export type AlertSeverity = 'info' | 'success' | 'warning' | 'error';

const SEVERITY_META: Record<AlertSeverity, { emoji: string; color: string; label: string }> = {
  info: { emoji: '🔵', color: '#2563eb', label: 'Info' },
  success: { emoji: '🟢', color: '#16a34a', label: 'Success' },
  warning: { emoji: '🟡', color: '#d97706', label: 'Warning' },
  error: { emoji: '🔴', color: '#dc2626', label: 'Error' },
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderAlertEmail({
  severity,
  title,
  message,
  context,
}: {
  severity: AlertSeverity;
  title: string;
  message: string;
  context?: Record<string, string>;
}) {
  const { emoji, color, label } = SEVERITY_META[severity];
  const subject = `${emoji} ${title}`;
  const contextEntries = Object.entries(context ?? {});

  const contextHtml = contextEntries.length
    ? `<table style="width:100%;border-collapse:collapse;margin-top:16px;">
        ${contextEntries
          .map(
            ([key, value]) => `<tr>
              <td style="padding:4px 12px 4px 0;color:#666;font-size:13px;vertical-align:top;white-space:nowrap;">${escapeHtml(key)}</td>
              <td style="padding:4px 0;color:#333;font-size:13px;">${escapeHtml(value)}</td>
            </tr>`,
          )
          .join('')}
      </table>`
    : '';

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background-color:#f5f5f5;">
  <div style="max-width:560px;margin:40px auto;background-color:#fff;border-radius:8px;overflow:hidden;border:1px solid #eee;">
    <div style="padding:16px 24px;border-left:4px solid ${color};background-color:#fafafa;">
      <span style="font-size:12px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;color:${color};">${label}</span>
    </div>
    <div style="padding:24px;">
      <h1 style="margin:0 0 12px 0;font-size:20px;color:#111;">${escapeHtml(title)}</h1>
      <p style="margin:0;font-size:14px;line-height:1.6;color:#333;white-space:pre-wrap;">${escapeHtml(message)}</p>
      ${contextHtml}
    </div>
  </div>
</body>
</html>`;

  const textContext = contextEntries.map(([key, value]) => `${key}: ${value}`).join('\n');
  const text = [`[${label.toUpperCase()}] ${title}`, '', message, textContext ? `\n${textContext}` : '']
    .filter(Boolean)
    .join('\n');

  return { subject, html, text };
}
