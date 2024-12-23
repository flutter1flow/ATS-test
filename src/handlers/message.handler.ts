import { inject, injectable } from 'tsyringe';
import { TelegramService } from '../services/telegram.service';
import { ITelegramRequest } from '../interfaces/telegram.interface';

@injectable()
export class MessageHandler {
	constructor(@inject(TelegramService) private readonly telegramService: TelegramService) {}

	/**
	 * Handles an incoming Telegram message request.
	 * @param request - The HTTP request containing the Telegram message.
	 * @returns A Response object indicating the result of the operation.
	 */
	async handleMessage(request: Request): Promise<Response> {
		try {
			const telegramRequest = await this.parseRequest(request);

			if (!this.isValidTelegramMessage(telegramRequest)) {
				return new Response('Invalid request: missing or invalid fields', { status: 400 });
			}

			const {
				chat: { id: chatId },
				text,
			} = telegramRequest.message;

			await this.telegramService.sendMessage(chatId, `You said: ${text}`);

			return new Response('Message sent successfully', { status: 200 });
		} catch (error) {
			console.error('Error handling message:', error);
			return new Response('Internal Server Error', { status: 500 });
		}
	}

	/**
	 * Parses the incoming HTTP request to extract the TelegramRequest.
	 * @param request - The HTTP request to parse.
	 * @returns A parsed TelegramRequest object.
	 * @throws An error if the JSON payload is invalid.
	 */
	private async parseRequest(request: Request): Promise<ITelegramRequest> {
		try {
			const body = await request.json();
			// console.log('Parsed Request Body:', JSON.stringify(body, null, 2));
			return body as ITelegramRequest;
		} catch (error) {
			console.error('Error parsing request body:', error);
			throw new Error('Invalid JSON payload');
		}
	}

	/**
	 * Validates the structure of a TelegramRequest.
	 * @param telegramRequest - The TelegramRequest object to validate.
	 * @returns True if the request is valid, otherwise false.
	 */
	private isValidTelegramMessage(telegramRequest: ITelegramRequest): boolean {
		// console.log('Validating Telegram Request:', JSON.stringify(telegramRequest, null, 2));
		if (!telegramRequest?.message?.chat?.id || typeof telegramRequest.message.chat.id !== 'number') {
			console.error('Validation failed: chat.id is missing or invalid');
			return false;
		}

		if (!telegramRequest.message.text || typeof telegramRequest.message.text !== 'string') {
			console.error('Validation failed: message.text is missing or invalid');
			return false;
		}

		return true;
	}
}
