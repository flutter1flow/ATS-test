import { inject, singleton } from 'tsyringe';
import { CommandHandler } from '@interfaces/handler.interface';
import { TelegramService } from '@services/telegram.service';
import { ICommand } from '@interfaces/command.interface';

@singleton()
export class HelpCommand extends CommandHandler {
	command = '/help';

	constructor(@inject(TelegramService) private telegramService: TelegramService) {
		super();
	}

	async handle(command: ICommand): Promise<Response> {
		await this.log(command.request);
		const msg = 'Help Command';
		await this.telegramService.sendOrUpdateMessage(command.chatId, msg);
		return new Response(msg, { status: 200 });
	}
}
