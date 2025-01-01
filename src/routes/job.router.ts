import { injectAll, singleton } from 'tsyringe';
import { IJobHandler } from '@interfaces/handler.interface';

@singleton()
export class JobRouter {
	private handlers: IJobHandler[];

	constructor(@injectAll('IJobHandler') handlers: IJobHandler[]) {
		this.handlers = handlers;
	}

	async route(event: ScheduledEvent): Promise<void> {
		console.log('Executing JobRouter');
		const eventTime = new Date(event.scheduledTime);
		const eventHour = eventTime.getHours();
		const eventMinute = eventTime.getMinutes();

		const jobsToRun = this.handlers
			.filter((handler) => handler.shouldRun(eventHour, eventMinute))
			.map((handler) => handler.handle(eventHour, eventMinute));

		await Promise.all(jobsToRun);
	}
}
