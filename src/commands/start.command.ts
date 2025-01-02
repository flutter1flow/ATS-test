import { inject, singleton } from 'tsyringe';
import { CommandHandler } from '@interfaces/handler.interface';
import { TelegramService } from '@services/telegram.service';
import { UserRepository } from '@repositories/user.repository';
import { User } from '@models/user.model';
import { ICommand } from '@interfaces/command.interface';

@singleton()
export class StartCommand extends CommandHandler {
	command = '/start';

	constructor(
		@inject(TelegramService) private telegramService: TelegramService,
		@inject(UserRepository) private userRepository: UserRepository
	) {
		super();
	}

	async handle(command: ICommand): Promise<Response> {
		await this.log(command.request);
		const user = new User(command.request.message.from);
		await this.userRepository.save(user);
		await this.telegramService.sendOrUpdateMessage(user.id, 'Start Command');
		return new Response('Start Command', { status: 200 });
	}
}
