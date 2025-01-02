import { inject, singleton } from 'tsyringe';
import { SlotService } from '@services/slot.service';
import { TelegramService } from '@services/telegram.service';
import { Slot } from '@models/slot.model';
import { InlineButton } from '@interfaces/telegram.interface';
import { UserRepository } from '@repositories/user.repository';
import { getGregorianDate, getHijriDate } from '@utils/date.util';
import { CalendarMessageRepository } from '@repositories/calendar.repository';

@singleton()
export class CalendarService {
	constructor(
		@inject(UserRepository) private userRepository: UserRepository,
		@inject(SlotService) private slotService: SlotService,
		@inject(CalendarMessageRepository) private cMRepository: CalendarMessageRepository,
		@inject(TelegramService) private telegramService: TelegramService
	) {}

	async sendCalendarAllUsers(): Promise<void> {
		const slots = await this.slotService.getSlots();
		const users = await this.userRepository.getIds();
		await Promise.all(
			users.map(async (userId) => {
				const calendarMessage = await this.cMRepository.get(userId);
				const messageId = calendarMessage?.messageId || undefined;
				console.log('Sending calendar to user:', userId, messageId);
				await this.sendCalendarMessage(userId, slots, messageId);
			})
		);
	}

	private async sendCalendarMessage(userId: number, slots: Slot[], messageId: number | undefined): Promise<void> {
		const calendar = this.buildCalendar(userId, slots);
		try {
			const text = messageId ? undefined : this.getCalendarTextMessage();
			const response = await this.telegramService.sendOrUpdateMessage(userId, text, calendar, messageId);
			console.log('Calendar sent to user:', userId, response.result.message_id);
			await this.cMRepository.save(userId, response.result.message_id);
		} catch (error) {
			console.error('Failed to send calendar to user:', userId, error);
		}
	}

	private buildCalendar(userId: number, slots: Slot[]): InlineButton[][] {
		const maxTextLength = Math.max(...slots.map((slot) => slot.time.length + 4));

		return slots.reduce((rows, slot, index) => {
			if (index % 2 === 0) rows.push([]);

			const isCurrentUserIncluded = slot.users.includes(userId);
			const hasOtherUsers = slot.users.some((id) => id !== userId);
			const icons = `${isCurrentUserIncluded ? ' ✅ ' : ' ❌ '}${hasOtherUsers ? ' 👤 ' : ''}`;

			const baseText = `${slot.time} ${icons}`.trim();
			const paddedText = baseText.padEnd(maxTextLength, ' ');

			rows[rows.length - 1].push(TelegramService.createInlineButton(paddedText, `/clickSlot ${slot.time}`));
			return rows;
		}, [] as InlineButton[][]);
	}

	private getCalendarTextMessage(): string {
		const date = `${getGregorianDate()}  [ ${getHijriDate()} ]`;
		const hadith =
			'📜 عن أنس بن مالك رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم: (( إنَّ للَّهِ أَهْلينَ منَ النَّاسِ قالوا: يا رسولَ اللَّهِ ، من هُم ؟ قالَ: هم أَهْلُ القرآنِ ، أَهْلُ اللَّهِ وخاصَّتُهُ . )) - 📚 حديث صحيح';
		const please = 'من فضلك قم باختيار الأوقات التي تكون فيها متاحا';
		return `${date}\n\n${hadith}\n\n${please}`;
	}
}
