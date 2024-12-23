export interface ITelegramChat {
	id: number;
}

export interface ITelegramMessageContent {
	chat: ITelegramChat;
	text: string;
}

export interface ITelegramRequest {
	message: ITelegramMessageContent;
}
