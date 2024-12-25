import { inject, singleton } from 'tsyringe';
import type { TEnv } from '../types/env.type';

@singleton()
export class TelegramService {
	private readonly botApiUrl: string;

	constructor(@inject('env') private env: TEnv) {
		this.botApiUrl = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`;
	}

	async sendMessage(chatId: number, text: string): Promise<void> {
		const responsePayload = { chat_id: chatId, text };

		const response = await fetch(this.botApiUrl, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(responsePayload),
		});

		if (!response.ok) {
			throw new Error(`Failed to send message: ${response.statusText}`);
		}
	}
}
