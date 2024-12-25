// src/models/user.model.ts

export interface User {
	id: number;
	username?: string;
	firstName: string;
	lastName?: string;
}

export class UserModel implements User {
	id: number;
	username?: string;
	firstName: string;
	lastName?: string;

	constructor(user: User) {
		this.id = user.id;
		this.username = user.username;
		this.firstName = user.firstName;
		this.lastName = user.lastName;
	}
}
