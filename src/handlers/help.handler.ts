import { inject, singleton } from 'tsyringe';
import { CommandHandler } from '@interfaces/handler.interface';
import { parseChatId } from '@utils/telegram.util';
import { TelegramService } from '@services/telegram.service';
import { ITelegramRequest } from '@interfaces/telegram.interface';

@singleton()
export class HelpHandler extends CommandHandler {
	command = '/help';

	constructor(@inject(TelegramService) private telegramService: TelegramService) {
		super();
	}

	async handle(request: ITelegramRequest): Promise<Response> {
		await this.log(request);
		const chatId = await parseChatId(request);
		const msg = 'Help Command';
		await this.telegramService.sendMessage(chatId, msg);
		return new Response(msg, { status: 200 });
	}
}
