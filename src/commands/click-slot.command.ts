import { inject, singleton } from 'tsyringe';
import { ICommand } from '@interfaces/command.interface';
import { CommandHandler } from '@interfaces/handler.interface';
import { TelegramService } from '@services/telegram.service';
import { SlotService } from '@services/slot.service';
import { CalendarService } from '@services/calendar.service';

@singleton()
export class ClickSlotCommand extends CommandHandler {
	command = '/clickSlot';

	constructor(
		@inject(TelegramService) private telegramService: TelegramService,
		@inject(SlotService) private slotService: SlotService,
		@inject(CalendarService) private calendarService: CalendarService
	) {
		super();
	}

	async handle(command: ICommand): Promise<Response> {
		await this.log(command.request);
		await this.slotService.changeUserState(command.args[0], command.chatId);
		await this.calendarService.sendCalendarAllUsers();
		await this.telegramService.answerCallbackQuery(command.request?.callback_query?.id);
		return new Response('Slot clicked', { status: 200 });
	}
}
