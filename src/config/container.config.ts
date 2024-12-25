import { container } from 'tsyringe';
import { HelpHandler } from '@handlers/help.handler';
import { StartHandler } from '@handlers/start.handler';

export class ContainerConfig {
	static registerHandlers(): void {
		console.log('Registering handlers');
		container.registerSingleton('ICommandHandler', HelpHandler);
		container.registerSingleton('ICommandHandler', StartHandler);
	}
}
