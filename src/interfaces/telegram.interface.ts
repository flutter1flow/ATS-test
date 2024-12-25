export interface ITelegramUser {
	id: number;
	username?: string;
	firstName: string;
	lastName?: string;
	isBot: boolean;
	languageCode?: string;
}

export interface ITelegramChat {
	id: number;
	firstName?: string;
	username?: string;
	type: 'private' | 'group' | 'supergroup' | 'channel';
}

export interface ITelegramMessageEntity {
	type: string;
	offset: number;
	length: number;
}

export interface ITelegramMessageContent {
	messageId: number;
	date: number;
	chat: ITelegramChat;
	from: ITelegramUser;
	text?: string;
	entities?: ITelegramMessageEntity[];
}

export interface ITelegramRequest {
	updateId: number;
	message: ITelegramMessageContent;
}
