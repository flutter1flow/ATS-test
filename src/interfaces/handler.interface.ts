import { ITelegramRequest } from '@interfaces/telegram.interface';

export interface ICommandHandler {
	command: string;

	handle(request: ITelegramRequest): Response | Promise<Response>;
}

export abstract class CommandHandler implements ICommandHandler {
	abstract command: string;

	async log(context: string | object): Promise<void> {
		console.log('Logging:', context);
	}

	abstract handle(request: ITelegramRequest): Response | Promise<Response>;
}
