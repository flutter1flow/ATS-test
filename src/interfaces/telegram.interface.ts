export interface ITelegramUser {
	id: number;
	username?: string;
	first_name: string;
	last_name?: string;
	is_bot: boolean;
	language_code?: string;
}

export interface ITelegramChat {
	id: number;
	first_name?: string;
	username?: string;
	type: 'private' | 'group' | 'supergroup' | 'channel';
}

export interface ITelegramMessageEntity {
	type: string;
	offset: number;
	length: number;
}

export interface ITelegramMessageContent {
	message_id: number;
	date: number;
	chat: ITelegramChat;
	from: ITelegramUser;
	text?: string;
	entities?: ITelegramMessageEntity[];
}

export interface ITelegramRequest {
	update_id: number;
	message: ITelegramMessageContent;
}
