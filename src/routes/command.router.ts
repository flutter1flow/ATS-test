import { injectAll, singleton } from 'tsyringe';
import { ICommandHandler } from '@interfaces/handler.interface';
import { parseCommand } from '@utils/telegram.util';
import { ITelegramRequest } from '@interfaces/telegram.interface';

@singleton()
export class CommandRouter {
	private handlers: Map<string, ICommandHandler>;

	constructor(@injectAll('ICommandHandler') handlers: ICommandHandler[]) {
		this.handlers = new Map(handlers.map((handler) => [handler.command, handler]));
	}

	async route(request: Request): Promise<Response> {
		const body: ITelegramRequest = await request.json();
		console.log('Request:', body);
		const command = await parseCommand(body);

		const handler = this.handlers.get(command);
		if (!handler) {
			return new Response('Command not found', { status: 404 });
		}

		return handler.handle(body);
	}
}
