// src/models/user.model.ts

import { ITelegramUser } from '@interfaces/telegram.interface';

export interface IUser {
	id: number;
	username?: string;
	first_name: string;
	last_name?: string;
}

export class User implements IUser {
	id: number;
	username?: string;
	first_name: string;
	last_name?: string;

	constructor(from: ITelegramUser) {
		this.id = from.id;
		this.username = from?.username;
		this.first_name = from.first_name;
		this.last_name = from?.last_name;
	}
}
