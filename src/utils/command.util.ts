import { ITelegramRequest } from '@interfaces/telegram.interface';

export const parseCommand = async (request: Request): Promise<string> => {
	try {
		const body: ITelegramRequest = await request.json();
		return body?.message?.text?.split(' ')[0]?.trim() || '';
	} catch {
		throw new Error('Invalid request format');
	}
};
