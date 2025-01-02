import { inject, singleton } from 'tsyringe';
import { CommandHandler } from '@interfaces/handler.interface';
import { TelegramService } from '@services/telegram.service';
import { UserRepository } from '@repositories/user.repository';
import { ICommand } from '@interfaces/command.interface';

@singleton()
export class AllUsersCommand extends CommandHandler {
	command = '/allUsers';

	constructor(
		@inject(TelegramService) private telegramService: TelegramService,
		@inject(UserRepository) private userRepository: UserRepository
	) {
		super();
	}

	async handle(command: ICommand): Promise<Response> {
		await this.log(command.request);
		const users = await this.userRepository.getIds();
		const msg = users.join('\n');
		await this.telegramService.sendOrUpdateMessage(command.chatId, msg);
		return new Response(msg, { status: 200 });
	}
}
