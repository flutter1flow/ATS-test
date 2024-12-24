import { inject, singleton } from 'tsyringe';
import { MessageHandler } from './message.handler';

@singleton()
export class RequestHandler {
	constructor(@inject(MessageHandler) private readonly messageHandler: MessageHandler) {}

	handleRequest = async (request: Request): Promise<Response> => {
		if (request.method === 'POST') {
			return await this.messageHandler.handleMessage(request);
		}
		return new Response('OK', { status: 200 });
	};
}
