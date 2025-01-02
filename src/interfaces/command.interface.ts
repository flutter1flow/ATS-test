import { ITelegramRequest } from '@interfaces/telegram.interface';

export interface ICommand {
	command: string;
	args: string[];
	request: ITelegramRequest;
	chatId: number;
}
