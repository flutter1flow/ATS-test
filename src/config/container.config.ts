import { container } from 'tsyringe';
import { HelpCommand } from '@commands/help.command';
import { StartCommand } from '@commands/start.command';
import { TableJob } from '@jobs/table.job';
import { AllUsersCommand } from '@commands/allUsers.command';

export class ContainerConfig {
	static registerHandlers(): void {
		console.log('Registering Command Handlers');
		container.registerSingleton('ICommandHandler', HelpCommand);
		container.registerSingleton('ICommandHandler', StartCommand);
		container.registerSingleton('ICommandHandler', AllUsersCommand);

		console.log('Registering Job Handlers');
		container.registerSingleton('IJobHandler', TableJob);
	}
}
