import { ITelegramRequest } from '@interfaces/telegram.interface';

export const parseCommand = async (body: ITelegramRequest): Promise<string> => {
	try {
		return body?.message?.text?.split(' ')[0]?.trim() || '';
	} catch {
		throw new Error('Invalid request format');
	}
};

export const parseChatId = async (body: ITelegramRequest): Promise<number> => {
	try {
		return body?.message?.chat?.id || 0;
	} catch {
		throw new Error('Invalid request format');
	}
};
