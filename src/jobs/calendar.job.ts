import { JobHandler } from '@interfaces/handler.interface';
import { inject, singleton } from 'tsyringe';
import type { TEnv } from '../types/env.type';
import { CalendarService } from '@services/calendar.service';

@singleton()
export class CalendarJob implements JobHandler {
	constructor(
		@inject('env') private env: TEnv,
		@inject(CalendarService) private calendarService: CalendarService
	) {}

	shouldRun(hour: number, minute: number): boolean {
		console.log('Checking CalendarHandler:', hour, minute);
		// return hour === 8 && minute > 28 && minute < 32;
		return true;
	}

	async handle(hour: number, minute: number): Promise<void> {
		console.log('Executing CalendarHandler:', hour, minute);
		await this.calendarService.sendCalendarAllUsers();
	}
}
