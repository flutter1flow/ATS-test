import { injectable, inject } from 'tsyringe';
import { TelegramService } from '../services/telegramService';

// Define the expected structure of the message
interface TelegramMessage {
	message: {
		chat: {
			id: number;
		};
		text: string;
	};
}

@injectable()
export class MessageHandler {
	constructor(@inject(TelegramService) private telegramService: TelegramService) {}

	async handleMessage(request: Request): Promise<Response> {
		try {
			// Explicitly type the result of request.json()
			const { message } = (await request.json()) as TelegramMessage;

			if (!message || !message.chat || !message.text) {
				return new Response('Invalid request: missing required message fields', { status: 400 });
			}

			const chatId = message.chat.id;
			const text = message.text;

			// Use the Telegram service to send a reply
			await this.telegramService.sendMessage(chatId, `You said: ${text}`);

			return new Response('Message sent', { status: 200 });
		} catch (error) {
			console.error('Error handling message:', error);
			return new Response('Internal Server Error', { status: 500 });
		}
	}
}
