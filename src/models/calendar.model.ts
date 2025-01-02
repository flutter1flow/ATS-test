export interface ICalendarMessage {
	date: string;
	userId: number;
	messageId: number;
}

export class CalendarMessage implements ICalendarMessage {
	date: string;
	userId: number;
	messageId: number;

	constructor(date: string, userId: number, messageId: number) {
		this.date = date;
		this.userId = userId;
		this.messageId = messageId;
	}
}
