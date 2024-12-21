import { container } from 'tsyringe';
import { TelegramService } from '../services/telegramService';
import { MessageHandler } from '../handlers/messageHandler';
import { EnvConfig } from '../interfaces/envConfig';

export const configureContainer = (env: EnvConfig): void => {
	container.register(TelegramService, {
		useFactory: () => new TelegramService(env.TELEGRAM_BOT_TOKEN),
	});

	container.register(MessageHandler, {
		useClass: MessageHandler,
	});
};

export { container };
