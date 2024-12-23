import { inject, injectable } from 'tsyringe';
import { MessageHandler } from './message.handler';

@injectable()
export class RequestHandler {
	constructor(@inject(MessageHandler) private readonly messageHandler: MessageHandler) {}

	handleRequest = async (request: Request): Promise<Response> => {
		if (request.method === 'POST') {
			return await this.messageHandler.handleMessage(request);
		}
		return new Response('OK', { status: 200 });
	};
}
