import { singleton } from 'tsyringe';
import { CommandHandler } from '@interfaces/handler.interface';

@singleton()
export class StartHandler extends CommandHandler {
	command = '/start';

	async handle(request: Request): Promise<Response> {
		await this.log(request);
		return new Response('Start Command', { status: 200 });
	}
}
