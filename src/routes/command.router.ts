import { injectAll, singleton } from 'tsyringe';
import { ICommandHandler } from '@interfaces/handler.interface';
import { ITelegramRequest } from '@interfaces/telegram.interface';
import { CommandDTO } from '../dto/command.dto';

@singleton()
export class CommandRouter {
	private handlers: Map<string, ICommandHandler>;

	constructor(@injectAll('ICommandHandler') handlers: ICommandHandler[]) {
		this.handlers = new Map(handlers.map((handler) => [handler.command, handler]));
	}

	async route(request: Request): Promise<Response> {
		const body: ITelegramRequest = await request.json();
		console.log('Request:', body);
		const command = new CommandDTO(body);

		const handler = this.handlers.get(command.command);
		if (!handler) {
			return new Response('Command not found', { status: 404 });
		}

		return handler.handle(command);
	}
}
