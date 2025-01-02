import { ICommand } from '@interfaces/command.interface';
import { ITelegramRequest } from '@interfaces/telegram.interface';

export class CommandDTO implements ICommand {
	command: string;
	args: string[];
	request: ITelegramRequest;
	chatId: number;

	constructor(request: ITelegramRequest) {
		this.request = request;
		const parts = (request?.message?.text || '').split(' ') || [];
		this.command = parts[0]?.trim() || '';
		this.args = parts.slice(1);
		this.chatId = request?.message?.chat?.id || 0;
	}
}
