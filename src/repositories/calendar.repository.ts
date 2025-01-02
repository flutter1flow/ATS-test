import { inject, singleton } from 'tsyringe';
import { KvStorage } from '@storage/kv.storage';
import { CalendarMessage, ICalendarMessage } from '@models/calendar.model';
import { getDate } from '@utils/date.util';

@singleton()
export class CalendarMessageRepository {
	private readonly date = getDate();
	private readonly calendarMessageKeyPrefix = `calendarMessage:${this.date}:`;

	constructor(@inject(KvStorage) private kvStorage: KvStorage) {}

	async save(userId: number, messageId: number): Promise<void> {
		const key = this.getCalendarMessageKey(userId);
		const messageCalendar = new CalendarMessage(this.date, userId, messageId);
		await this.kvStorage.set<ICalendarMessage>(key, messageCalendar);
	}

	async get(userId: number): Promise<ICalendarMessage | null> {
		const key = this.getCalendarMessageKey(userId);
		return await this.kvStorage.get<ICalendarMessage>(key);
	}

	async getAll(): Promise<ICalendarMessage[]> {
		const prefix = this.calendarMessageKeyPrefix;
		const messages = await this.kvStorage.listWithPrefix<ICalendarMessage>(prefix);
		return messages.map(({ value }) => value);
	}

	private getCalendarMessageKey(userId: number): string {
		return `${this.calendarMessageKeyPrefix}${userId}`;
	}
}
