import { inject, singleton } from 'tsyringe';
import { CommandHandler } from '@interfaces/handler.interface';
import { TelegramService } from '@services/telegram.service';
import { parseChatId } from '@utils/telegram.util';
import { ITelegramRequest } from '@interfaces/telegram.interface';

@singleton()
export class StartCommand extends CommandHandler {
	command = '/start';

	constructor(@inject(TelegramService) private telegramService: TelegramService) {
		super();
	}

	async handle(request: ITelegramRequest): Promise<Response> {
		await this.log(request);
		const chatId = await parseChatId(request);
		const msg = 'Start Command';
		await this.telegramService.sendMessage(chatId, msg);
		return new Response(msg, { status: 200 });
	}
}
