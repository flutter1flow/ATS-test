import { inject, singleton } from 'tsyringe';
import { CommandHandler } from '@interfaces/handler.interface';
import { parseChatId } from '@utils/telegram.util';
import { TelegramService } from '@services/telegram.service';
import { ITelegramRequest } from '@interfaces/telegram.interface';
import { UserRepository } from '@repositories/user.repository';

@singleton()
export class AllUsersCommand extends CommandHandler {
	command = '/allUsers';

	constructor(
		@inject(TelegramService) private telegramService: TelegramService,
		@inject(UserRepository) private userRepository: UserRepository
	) {
		super();
	}

	async handle(request: ITelegramRequest): Promise<Response> {
		await this.log(request);
		const chatId = await parseChatId(request);
		const users = await this.userRepository.getIds();
		const msg = users.join('\n');
		await this.telegramService.sendMessage(chatId, msg);
		return new Response(msg, { status: 200 });
	}
}
