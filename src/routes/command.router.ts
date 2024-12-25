import { injectAll, singleton } from 'tsyringe';
import { ICommandHandler } from '@interfaces/handler.interface';
import { parseCommand } from '@utils/command.util';

@singleton()
export class CommandRouter {
	private handlers: Map<string, ICommandHandler>;

	constructor(@injectAll('ICommandHandler') handlers: ICommandHandler[]) {
		this.handlers = new Map(handlers.map((handler) => [handler.command, handler]));
	}

	async handleCommand(request: Request): Promise<Response> {
		const command = await parseCommand(request);

		const handler = this.handlers.get(command);
		if (!handler) {
			return new Response('Command not found', { status: 404 });
		}

		return handler.handle(request);
	}
}
