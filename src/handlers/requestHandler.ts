import { configureContainer, container } from '../config/diContainer';
import { MessageHandler } from './messageHandler';

export const handleRequest = async (request: Request, env: { TELEGRAM_BOT_TOKEN: string }): Promise<Response> => {
	configureContainer(env);
	const messageHandler = container.resolve(MessageHandler);
	return messageHandler.handleMessage(request);
};
