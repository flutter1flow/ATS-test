export interface ISlot {
	date: string;
	time: string;
	users: number[];
}

export class Slot implements ISlot {
	date: string;
	time: string;
	users: number[];

	constructor(date: string, time: string) {
		this.date = date;
		this.time = time;
		this.users = [];
	}
}
