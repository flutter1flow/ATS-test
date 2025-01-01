import { JobHandler } from '@interfaces/handler.interface';
import { inject, singleton } from 'tsyringe';
import { TelegramService } from '@services/telegram.service';
import type { TEnv } from '../types/env.type';
import { UserRepository } from '@repositories/user.repository';

@singleton()
export class TableJob implements JobHandler {
	constructor(
		@inject('env') private env: TEnv,
		@inject(TelegramService) private telegramService: TelegramService,
		@inject(UserRepository) private userRepository: UserRepository
	) {}

	shouldRun(hour: number, minute: number): boolean {
		console.log('Checking TableHandler:', hour, minute);
		return true;
	}

	async handle(hour: number, minute: number): Promise<void> {
		console.log('Executing TableHandler:', hour, minute);
		// await this.telegramService.sendMessage(Number(this.env.CHAT_ID), 'Table Job');
	}
}
