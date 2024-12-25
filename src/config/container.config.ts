import { container } from 'tsyringe';
import type { TEnv } from '../types/env.type';
import { HelpHandler } from '@handlers/help.handler';
import { StartHandler } from '@handlers/start.handler';

export class ContainerConfig {
	static initialize(env: TEnv): void {
		console.log('Container start initialization');
		container.registerInstance('env', env);
		container.registerSingleton('ICommandHandler', HelpHandler);
		container.registerSingleton('ICommandHandler', StartHandler);
	}
}
