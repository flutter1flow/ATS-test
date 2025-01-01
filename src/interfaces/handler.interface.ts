import { ITelegramRequest } from '@interfaces/telegram.interface';

// Command Handler Interface

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

// Job Handler Interface

export interface IJobHandler {
	shouldRun(hour: number, minute: number): boolean;

	handle(hour: number, minute: number): Promise<void>;
}

export abstract class JobHandler implements IJobHandler {
	abstract shouldRun(hour: number, minute: number): boolean;

	abstract handle(hour: number, minute: number): Promise<void>;
}
