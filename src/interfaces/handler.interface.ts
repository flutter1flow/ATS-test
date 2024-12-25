export interface ICommandHandler {
	command: string;

	handle(request: Request): Response | Promise<Response>;
}

export abstract class CommandHandler implements ICommandHandler {
	abstract command: string;

	async log(context: string | object): Promise<void> {
		console.log('Logging:', context);
	}

	abstract handle(request: Request): Response | Promise<Response>;
}
