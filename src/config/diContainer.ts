import { container } from 'tsyringe';
import { TelegramService } from '../services/telegram.service';
import { MessageHandler } from '../handlers/message.handler';
import { EnvInterface } from '../interfaces/env.interface';
import { CacheService } from '../services/cache.service';
import { KVRepository } from '../repositories/kv.repository';

export const configureContainer = (env: EnvInterface): void => {
	registerEnvVariables(env);
	container.registerSingleton(KVRepository);
	container.registerSingleton(CacheService);
	container.registerSingleton(TelegramService);
	container.registerSingleton(MessageHandler);
};

const registerEnvVariables = (env: EnvInterface): void => {
	Object.entries(env).forEach(([key, value]) => {
		container.register(key, { useValue: value });
	});
};

export { container };
