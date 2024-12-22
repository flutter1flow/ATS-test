import { injectable } from 'tsyringe';

@injectable()
export class TelegramService {
	private botApiUrl: string;

	constructor(botToken: string) {
		if (!botToken) {
			throw new Error('Bot token is required.');
		}
		this.botApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
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
