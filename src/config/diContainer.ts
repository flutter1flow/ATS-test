import { container } from 'tsyringe';
import { TelegramService } from '../services/telegramService';
import { MessageHandler } from '../handlers/messageHandler';

export const configureContainer = (env: { TELEGRAM_BOT_TOKEN: string }) => {
	container.register(TelegramService, {
		useFactory: () => new TelegramService(env.TELEGRAM_BOT_TOKEN),
	});

	container.register(MessageHandler, {
		useClass: MessageHandler,
	});
};

export { container };
