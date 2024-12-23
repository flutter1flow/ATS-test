import { container } from 'tsyringe';
import { TelegramService } from '../services/telegram.service';
import { MessageHandler } from '../handlers/message.handler';
import { IEnvConfig } from '../interfaces/IEnvConfig';
import { CacheService } from '../services/cache.service';
import { KVRepository } from '../repositories/kv.repository';

export const configureContainer = (env: IEnvConfig): void => {
	registerEnvVariables(env);
	container.registerSingleton(KVRepository);
	container.registerSingleton(CacheService);
	container.registerSingleton(TelegramService);
	container.registerSingleton(MessageHandler);
};

const registerEnvVariables = (env: IEnvConfig): void => {
	Object.entries(env).forEach(([key, value]) => {
		container.register(key, { useValue: value });
	});
};

export { container };
