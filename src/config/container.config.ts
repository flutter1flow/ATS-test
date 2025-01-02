import { container } from 'tsyringe';
import { HelpCommand } from '@commands/help.command';
import { StartCommand } from '@commands/start.command';
import { CalendarJob } from '@jobs/calendar.job';
import { AllUsersCommand } from '@commands/all-users.command';
import { ClickSlotCommand } from '@commands/click-slot.command';

export class ContainerConfig {
	static registerHandlers(): void {
		console.log('Registering Command Handlers');
		container.registerSingleton('ICommandHandler', HelpCommand);
		container.registerSingleton('ICommandHandler', StartCommand);
		container.registerSingleton('ICommandHandler', AllUsersCommand);
		container.registerSingleton('ICommandHandler', ClickSlotCommand);

		console.log('Registering Job Handlers');
		container.registerSingleton('IJobHandler', CalendarJob);
	}
}
