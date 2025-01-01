import { JobHandler } from '@interfaces/handler.interface';

export class TableJob implements JobHandler {
	shouldRun(hour: number, minute: number): boolean {
		console.log('Checking TableHandler:', hour, minute);
		return true;
	}

	async handle(hour: number, minute: number): Promise<void> {
		console.log('Executing TableHandler:', hour, minute);
	}
}
