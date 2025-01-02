import { inject, singleton } from 'tsyringe';
import type { TEnv } from '../types/env.type';
import { InlineButton, ITelegramResponse } from '@interfaces/telegram.interface';

@singleton()
export class TelegramService {
	private readonly botApiUrl: string;

	constructor(@inject('env') private env: TEnv) {
		this.botApiUrl = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}`;
	}

	static createInlineButton(text: string, callbackData: string): InlineButton {
		return { text, callback_data: callbackData };
	}

	async sendOrUpdateMessage(chatId: number, text?: string, buttons?: InlineButton[][], messageId?: number): Promise<ITelegramResponse> {
		const state = messageId ? (buttons ? 'editMessageReplyMarkup' : 'editMessageText') : 'sendMessage';
		console.log('Sending or updating message:', state, chatId, messageId);
		console.log('Text:', text);
		console.log(`${this.botApiUrl}/${state}`);
		const payload = {
			chat_id: chatId,
			message_id: messageId || undefined,
			text,
			parse_mode: text ? 'HTML' : undefined,
			reply_markup: buttons ? { inline_keyboard: buttons } : undefined,
		};

		try {
			const response = await fetch(`${this.botApiUrl}/${state}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});

			if (!response.ok) {
				throw new Error(
					`Failed to ${state} message ID ${messageId} to chat ID ${chatId}: ${response.statusText}: ${await response.text()}`
				);
			}

			return response.json();
		} catch (error) {
			if (error instanceof Error) {
				console.error('Error during sendOrUpdateMessage:', error.message, { payload });
			} else {
				console.error('Error during sendOrUpdateMessage:', error);
			}
			throw error;
		}
	}

	async answerCallbackQuery(callbackQueryId?: string, text?: string): Promise<ITelegramResponse> {
		if (!callbackQueryId) {
			console.log('No callbackQueryId provided, skipping answerCallbackQuery');
			return { ok: true, result: { message_id: 0 } };
		}
		const payload = {
			callback_query_id: callbackQueryId,
			text,
		};

		try {
			const response = await fetch(`${this.botApiUrl}/answerCallbackQuery`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});

			if (!response.ok) {
				throw new Error(`Failed to answerCallbackQuery: ${response.statusText}: ${await response.text()}`);
			}

			return response.json();
		} catch (error) {
			if (error instanceof Error) {
				console.error('Error during answerCallbackQuery:', error.message, { payload });
			} else {
				console.error('Error during answerCallbackQuery:', error);
			}
			throw error;
		}
	}
}
