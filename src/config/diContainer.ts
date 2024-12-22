import { container } from 'tsyringe';
import { TelegramService } from '../services/telegram.service';
import { MessageHandler } from '../handlers/message.handler';
import { EnvConfigInterface } from '../interfaces/envConfig.interface';

export const configureContainer = (env: EnvConfigInterface): void => {
	registerEnvVariables(env);
	container.registerInstance(TelegramService, new TelegramService(env.TELEGRAM_BOT_TOKEN));
	container.registerSingleton(MessageHandler);
};

const registerEnvVariables = (env: EnvConfigInterface): void => {
	Object.entries(env).forEach(([key, value]) => {
		container.register(key, { useValue: value });
	});
};

export { container };
