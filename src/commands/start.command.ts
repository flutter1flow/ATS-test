import { inject, singleton } from 'tsyringe';
import { CommandHandler } from '@interfaces/handler.interface';
import { TelegramService } from '@services/telegram.service';
import { ITelegramRequest } from '@interfaces/telegram.interface';
import { UserRepository } from '@repositories/user.repository';
import { User } from '@models/user.model';

@singleton()
export class StartCommand extends CommandHandler {
	command = '/start';

	constructor(
		@inject(TelegramService) private telegramService: TelegramService,
		@inject(UserRepository) private userRepository: UserRepository
	) {
		super();
	}

	async handle(request: ITelegramRequest): Promise<Response> {
		await this.log(request);
		const user = new User(request.message.from);
		await this.userRepository.save(user);
		await this.telegramService.sendMessage(user.id, 'Start Command');
		return new Response('Start Command', { status: 200 });
	}
}
