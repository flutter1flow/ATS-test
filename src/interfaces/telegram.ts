export interface TelegramChat {
	id: number;
}

export interface TelegramMessageContent {
	chat: TelegramChat;
	text: string;
}

export interface TelegramRequest {
	message: TelegramMessageContent;
}
