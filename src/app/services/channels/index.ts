import { emailChannel } from './email';
import { slackChannel } from './slack';
import { telegramChannel } from './telegram';
import { smsChannel } from './sms';
import { webhookChannel } from './webhook';

export type { Channel } from './types';
export const CHANNELS = [emailChannel, slackChannel, telegramChannel, smsChannel, webhookChannel];
