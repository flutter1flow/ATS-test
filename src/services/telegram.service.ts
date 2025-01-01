import { inject, singleton } from 'tsyringe';
import type { TEnv } from '../types/env.type';
import { InlineButton } from '@interfaces/telegram.interface';

@singleton()
export class TelegramService {
	private readonly botApiUrl: string;

	constructor(@inject('env') private env: TEnv) {
		this.botApiUrl = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`;
	}

	static createInlineButton(text: string, callbackData: string): InlineButton {
		return { text, callback_data: callbackData };
	}

	async sendMessage(chatId: number, text: string, buttons?: InlineButton[][]): Promise<void> {
		const payload = {
			chat_id: chatId,
			text,
			parse_mode: 'HTML',
			reply_markup: buttons ? { inline_keyboard: buttons } : undefined,
		};

		const response = await fetch(this.botApiUrl, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		});

		if (!response.ok) {
			throw new Error(`Failed to send message to chat ID ${chatId}: ${response.statusText}`);
		}
	}
}
