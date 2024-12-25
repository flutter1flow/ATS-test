import { singleton } from 'tsyringe';
import { CommandHandler } from '@interfaces/handler.interface';

@singleton()
export class HelpHandler extends CommandHandler {
	command = '/help';

	async handle(request: Request): Promise<Response> {
		await this.log(request);
		return new Response('Help Command', { status: 200 });
	}
}
