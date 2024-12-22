import { container } from 'tsyringe';
import { TelegramService } from '../services/telegramService';
import { MessageHandler } from '../handlers/messageHandler';
import { EnvConfig } from '../interfaces/envConfig';

export const configureContainer = (env: EnvConfig): void => {
	registerEnvVariables(env);
	container.registerInstance(TelegramService, new TelegramService(env.TELEGRAM_BOT_TOKEN));
	container.registerSingleton(MessageHandler);
};

const registerEnvVariables = (env: EnvConfig): void => {
	Object.entries(env).forEach(([key, value]) => {
		container.register(key, { useValue: value });
	});
};

export { container };
