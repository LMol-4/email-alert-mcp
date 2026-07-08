import type { AlertInput } from '@/app/services/alert';

export interface Channel {
  name: string;
  isConfigured(): boolean;
  send(alert: AlertInput): Promise<void>;
}
